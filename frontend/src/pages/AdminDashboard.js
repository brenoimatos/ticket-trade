import React, { useEffect, useState } from 'react'
import {
  Grid,
  Card,
  CardHeader,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TablePagination,
} from '@mui/material'
import ReactApexChart from 'react-apexcharts'
import api from '../api'
import useChart from '../components/chart'
import moment from 'moment'

export default function AdminDashboard() {
  const [ticketData, setTicketData] = useState([])
  const [userData, setUserData] = useState([])
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0) // Added for tracking total count

  const chartOptions = useChart({
    xaxis: { type: 'datetime' },
  })

  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
    const { data, totalCount } = await api.getDashUsers(
      newPage * rowsPerPage,
      rowsPerPage
    )
    setTableData(data)
    setTotalCount(totalCount) // Update total count
  }

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0)
    const { data, totalCount } = await api.getDashUsers(0, newRowsPerPage)
    setTableData(data)
    setTotalCount(totalCount) // Update total count
  }

  useEffect(() => {
    const fetchData = async () => {
      const ticketStats = await api.getDashTicketsStats()
      const userStats = await api.getDashUsersStats()
      const { data, totalCount } = await api.getDashUsers(0, rowsPerPage) // Fetch total count along with initial data
      setTicketData(ticketStats)
      setUserData(userStats)
      setTableData(data)
      setTotalCount(totalCount) // Set initial total count
    }

    fetchData()
  }, [rowsPerPage])

  return (
    <Grid container justifyContent="center" sx={{ pb: 3, pt: 3 }}>
      <Grid container spacing={3} sx={{ width: { sm: '80%', xs: '100%' } }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Usuários Cadastrados" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
              <ReactApexChart
                type="line"
                series={[
                  {
                    name: 'Users',
                    data: userData.map((item) => ({
                      x: item.created_date,
                      y: item.users,
                    })),
                  },
                ]}
                options={chartOptions}
                height={325}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Últimos Usuários Cadastrados" />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Nome</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {moment(row.created_at).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>
                        {row.first_name + ' ' + row.last_name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount} // Using the total count from the API
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Ingressos de Compra e Venda" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
              <ReactApexChart
                type="line"
                series={[
                  {
                    name: 'Ofertas de Compra',
                    data: ticketData.map((item) => ({
                      x: item.created_date,
                      y: item.buying_tickets,
                    })),
                  },
                  {
                    name: 'Ofertas de Venda',
                    data: ticketData.map((item) => ({
                      x: item.created_date,
                      y: item.selling_tickets,
                    })),
                  },
                ]}
                options={chartOptions}
                height={325}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}
