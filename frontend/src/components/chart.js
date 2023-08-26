import merge from 'lodash/merge'
import { useTheme } from '@mui/material/styles'

export default function useChart(options) {
  const theme = useTheme()

  const baseOptions = {
    // General chart options
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: theme.typography.fontFamily,
    },
    // X-axis options
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      type: 'datetime', // Setting default as datetime
    },
    // Tooltip options
    tooltip: {
      shared: true,
      intersect: false,
    },
    // Grid options
    grid: {
      borderColor: theme.palette.divider,
    },
    // Colors
    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.success.main,
    ],
    // Responsive behavior
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: { bar: { columnWidth: '40%' } },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: { bar: { columnWidth: '32%' } },
        },
      },
    ],
  }

  return merge(baseOptions, options)
}
