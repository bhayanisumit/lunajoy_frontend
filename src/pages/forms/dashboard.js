import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Header from "../../components/header";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import socketIOClient from "socket.io-client";
import axios from "axios";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Chart.register(...registerables);



//  chart data
 const  Dashboard = () =>  {
  const columns = [
    { label: "id", id: "id" },
    { label: "Mood Rating", id: "mood_rating" },
    { label: "Anxiety", id: "anxiety" },
    { label: "Sleep Hours", id: "sleep_hours" },
    { label: "Sleep Quality", id: "sleep_quality" },
    { label: "Sleep Disturbance", id: "sleep_disturbance" },
    { label: "Physical Activity Type", id: "physical_activity_type" },
    { label: "Physical Activity Duration", id: "physical_activity_duration" },
    { label: "Social Interaction", id: "social_interaction" },
    { label: "Stress Level", id: "stress_level" },
    { label: "Symptoms", id: "symptoms" },
  ];
  const initialBarChartData = {
    labels: ["Sleep Hours", "Physical Activity Duration"],
    datasets: [
      {
        label: "Values",
        data: [0.1, 0],
        backgroundColor: ["#002F5A", "#88C2FF"],
        borderWidth: 1,
      },
    ],
  }

  const initialPieChartData ={ labels: ["Sleep Hours", "Physical Activity Duration"],
  datasets: [
    {
      label: "Values",
      data: [0.1, 0],
      backgroundColor: ["#002F5A", "#88C2FF"],
      borderWidth: 1,
    },
  ]}
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [barChartData, setBarChartData] = useState(initialBarChartData);
  const [pieChartData, setPieChartData] = useState(initialPieChartData);
 
  const getData = async() => {
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/log`, {
      headers: {
        Authorization: `${localStorage.getItem("auth")}`, // Set the Authorization header
      },
      withCredentials: true,
    });
    if(response.data.data > 0) return setRows([])

    
    const data = Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    
    setRows(data);
  
  }

  useEffect(() => {
    getData();
 }, []);

  const calculateTotalSleepandactivityHours = (gdata) => {
 
  
    const totalSleepHours = gdata?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.sleep_hours;
    }, 0);
    
    const totalActivityHours = gdata?.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.physical_activity_duration;
    }, 0);

    return { activityHour :  totalActivityHours , sleepHour : totalSleepHours }
   
    
  };

  useEffect(() => {
   
    if (localStorage.getItem("auth") !== null ||  localStorage.getItem("auth") !== undefined) {
      const socket = socketIOClient("http://localhost:3033", {
        query: "token=" + localStorage.getItem("auth"),
      });
      socket.on("newLog", (data) => {
         
        const graphData =   calculateTotalSleepandactivityHours(data)
            setBarChartData({
              ...initialBarChartData,
              datasets: [
                {
                  ...initialBarChartData?.datasets[0],
                  data: [graphData.sleepHour , graphData.activityHour],
                },
              ],
            });
      
            setPieChartData({
              ...initialPieChartData,
              datasets: [
                {
                  ...initialPieChartData?.datasets[0],
                  data: [graphData.sleepHour , graphData.activityHour],
                },
              ],
            });
        });
      return () => {
        socket.disconnect();
      };
    }
   
 }, []);


 
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container-fluied p-5 pt-4">
        <div className="row ">
        { rows?.length  <= 0   ? <> <div className="col-12 h-25 ">No Data Found</div></> :     <div className="col-12 h-25 ">
            <div className="card dashboard-card ">
           
           <div className="card dashboard-card ">
                <Paper sx={{ width: "100%" }}>
                  <TableContainer
                    sx={{
                      maxHeight: 480,
                      overflowY: "scroll",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      "MsOverflowStyle": "none",
                      "scrollbarWidth": "none",
                    }}
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table position-fixed"
                    >
                      <TableHead>
                        <TableRow>
                          {columns?.map((column) => (
                            <TableCell
                              className=""
                              key={column.id}
                              style={{
                                minWidth: column.minWidth,
                                backgroundColor: "#DDE8FC",
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          ).map((row) => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              {columns?.map((column) => {
                                const value = row[column.id];
                                
                                return (
                                  <TableCell key={`${row.id}-${column.id}`}>
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component="div"
                    count={rows?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>  
            </div>
            <div className="mb-3 col-12 d-flex justify-content-center">
              <div>
              <label
                htmlFor="anxiety"
                className="form-label fw-semibold "
              ></label>
             
              </div>
            </div>

          
            <div className="container">
              <div className="row d-flex justify-content-center">
                <div className="col-md-6 col-12"  style={{maxWidth : "300px"}}>
                  <div className="pie-chart-container">
                    <Pie data={pieChartData} className="chart" />
                  </div>
                </div>
                <div className="col-md-6 col-12 mt-auto p-5" >
                  <div className="bar-chart-container" style={{maxWidth : "500px"}}>
                    <Bar
                      data={barChartData}
                      options={ {"scales": {"x": {"beginAtZero": true} }}}
                      className="chart1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> }
        </div>
      </div>
    </>
  );
}
export default Dashboard;