

<Grid container spacing={4}>
{/* Inventory Overview Chart */}
<Grid item xs={12} md={6}>
  <AnimatedCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom color="secondary.main">
        Inventory Overview
      </Typography>
      <PieChart
        series={[
          {
            data: Object.entries(inventory).map(
              ([name, quantity]) => ({
                id: name,
                value: quantity,
                label: name,
              })
            ),
            innerRadius: 30,
            paddingAngle: 2,
            cornerRadius: 5,
            highlightScope: {
              faded: "global",
              highlighted: "item",
            },
            faded: { innerRadius: 30, additionalRadius: -30 },
          },
        ]}
        width={500}
        height={300}
        colors={[
          customTheme.palette.primary.main,
          customTheme.palette.secondary.main,
          customTheme.palette.error.main,
        ]}
      />
    </CardContent>
  </AnimatedCard>
</Grid>

{/* Top Items Chart */}
<Grid item xs={12} md={6}>
  <AnimatedCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom color="secondary.main">
        Top 5 Items
      </Typography>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: Object.keys(inventory).slice(0, 5),
          },
        ]}
        series={[
          {
            data: Object.values(inventory).slice(0, 5),
            color: customTheme.palette.primary.main,
          },
        ]}
        width={500}
        height={300}
      />
    </CardContent>
  </AnimatedCard>
</Grid>
</Grid>