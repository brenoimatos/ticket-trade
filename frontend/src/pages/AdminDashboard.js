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
  Typography,
} from '@mui/material'
import ReactApexChart from 'react-apexcharts'
import api from '../api'
import useChart from '../components/chart'
import moment from 'moment'

export default function AdminDashboard() {
  const [userTableData, setUserTableData] = useState([])
  const [userPage, setUserPage] = useState(0)
  const [userRowsPerPage, setUserRowsPerPage] = useState(5)
  const [userTotalCount, setUserTotalCount] = useState(0)

  const [eventTableData, setEventTableData] = useState([])
  const [eventPage, setEventPage] = useState(0)
  const [eventRowsPerPage, setEventRowsPerPage] = useState(5)
  const [eventTotalCount, setEventTotalCount] = useState(0)

  const [ticketData, setTicketData] = useState([])
  const [userData, setUserData] = useState([])

  const chartOptions = useChart({
    xaxis: { type: 'datetime' },
  })

  const handleChangeUserPage = async (event, newUserPage) => {
    setUserPage(newUserPage)
    const { data, totalCount } = await api.getDashUsers(
      newUserPage * userRowsPerPage,
      userRowsPerPage
    )
    setUserTableData(data)
    setUserTotalCount(totalCount)
  }

  const handleChangeUserRowsPerPage = async (event) => {
    const newUserRowsPerPage = parseInt(event.target.value, 10)
    setUserRowsPerPage(newUserRowsPerPage)
    setUserPage(0)
    const { data, totalCount } = await api.getDashUsers(0, newUserRowsPerPage)
    setUserTableData(data)
    setUserTotalCount(totalCount)
  }

  // Função para manipular a paginação e buscar dados da tabela de eventos
  const handleChangeEventPage = async (event, newEventPage) => {
    setEventPage(newEventPage)
    const { data, totalCount } = await api.getDashEvents(
      newEventPage * eventRowsPerPage,
      eventRowsPerPage
    )
    setEventTableData(data)
    setEventTotalCount(totalCount)
  }

  const handleChangeEventRowsPerPage = async (event) => {
    const newEventRowsPerPage = parseInt(event.target.value, 10)
    setEventRowsPerPage(newEventRowsPerPage)
    setEventPage(0)
    const { data, totalCount } = await api.getDashEvents(0, newEventRowsPerPage)
    setEventTableData(data)
    setEventTotalCount(totalCount)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, totalCount } = await api.getDashUsers(0, userRowsPerPage)
      const userStats = await api.getDashUsersStats()
      setUserData(userStats)
      setUserTableData(data)
      setUserTotalCount(totalCount)
    }

    fetchUserData()
  }, [userRowsPerPage]) // este useEffect será re-executado sempre que userRowsPerPage mudar

  useEffect(() => {
    const fetchEventAndTicketData = async () => {
      const ticketStats = await api.getDashTicketsStats()
      setTicketData(ticketStats)
      const { data, totalCount } = await api.getDashEvents(0, eventRowsPerPage)
      setEventTableData(data)
      setEventTotalCount(totalCount)
    }
    fetchEventAndTicketData()
  }, [eventRowsPerPage])

  return (
    <Grid container justifyContent="center" sx={{ pb: 3, pt: 3 }}>
      <Grid item xs={12}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 3,
          }}
        >
          Dashboard
        </Typography>
      </Grid>
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
                  {userTableData.map(
                    (
                      row // Usando userTableData para os usuários
                    ) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {moment(row.created_at).format('DD/MM/YYYY HH:mm')}
                        </TableCell>
                        <TableCell>
                          {row.first_name + ' ' + row.last_name}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={userTotalCount} // Usando userTotalCount para os usuários
                rowsPerPage={userRowsPerPage}
                page={userPage}
                onPageChange={handleChangeUserPage}
                onRowsPerPageChange={handleChangeUserRowsPerPage}
              />
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Top Eventos com Ofertas" />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>id</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Local</TableCell>
                    <TableCell>Ofertas Total</TableCell>
                    <TableCell>Ofertas Compra</TableCell>
                    <TableCell>Ofertas Venda</TableCell>
                    <TableCell>Preço Médio Compra</TableCell>
                    <TableCell>Preço Médio Venda</TableCell>
                    <TableCell>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventTableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.total_tickets}</TableCell>
                      <TableCell>{row.tickets_buying}</TableCell>
                      <TableCell>{row.tickets_selling}</TableCell>
                      <TableCell>{row.average_price_buying}</TableCell>
                      <TableCell>{row.average_price_selling}</TableCell>
                      <TableCell>
                        {moment(row.date).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={eventTotalCount} // Usando userTotalCount para os usuários
                rowsPerPage={eventRowsPerPage}
                page={eventPage}
                onPageChange={handleChangeEventPage}
                onRowsPerPageChange={handleChangeEventRowsPerPage}
              />
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}
