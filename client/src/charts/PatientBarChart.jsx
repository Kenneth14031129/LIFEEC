// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const PatientBarChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for testing with all 12 months
        const result = [
          { _id: 1, count: 5 },   // January - 5 patients
          { _id: 2, count: 8 },   // February - 8 patients
          { _id: 3, count: 3 },   // March - 3 patients
          { _id: 4, count: 7 },   // April - 7 patients
          { _id: 5, count: 2 },   // May - 2 patients
          { _id: 6, count: 6 },   // June - 6 patients
          { _id: 7, count: 4 },   // July - 4 patients
          { _id: 8, count: 9 },   // August - 9 patients
          { _id: 9, count: 11 },  // September - 11 patients
          { _id: 10, count: 5 },  // October - 5 patients
          { _id: 11, count: 3 },  // November - 3 patients
          { _id: 12, count: 10 }, // December - 10 patients
        ];

        // Define month names
        const monthNames = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ];

        // Replace null or invalid values with a default "January" as a fallback
        const transformedResult = result.map((item) => {
          const monthIndex = item._id !== null ? parseInt(item._id) - 1 : null;
          const monthName = monthIndex !== null && monthIndex >= 0 && monthIndex < 12 
            ? monthNames[monthIndex] 
            : "January";  // Default to "January" if month is invalid

          return {
            ...item,
            _id: monthName, // Use the mapped month name or "January" as default
          };
        });

        if (transformedResult && transformedResult.length > 0) {
          const months = transformedResult.map((item) => item._id); // Array of months
          const counts = transformedResult.map((item) => item.count); // Array of patient counts

          setChartData({
            series: [
              {
                name: "Number of Emergency Alert",
                data: counts,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 1500, // Smooth animation
                },
                background: "#2E3B4E", // Dark background for contrast
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  borderRadius: 4,  // Rounded bar edges for a modern look
                  columnWidth: "50%", // Adjust bar width to fit all months
                },
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  gradientToColors: ["#004DFF", "#FF0000"], // Gradient colors for the bars
                  inverseColors: false,
                  opacityFrom: 1,
                  opacityTo: 0.7,
                  stops: [0, 100],
                },
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["#fff"], // White stroke for contrast
              },
              dataLabels: {
                enabled: true,
                style: {
                  colors: ["#ffffff"], // White labels for readability
                },
                formatter: function (val) {
                  return Math.round(val); // Display values as whole numbers
                },
              },
              grid: {
                show: true,
                borderColor: "#444",  // Darkened grid lines for subtle effect
                strokeDashArray: 5,   // Dashed grid lines for cleaner design
              },
              xaxis: {
                categories: months, // Display the months
                title: {
                  text: "Month",
                  style: {
                    color: "#ffffff", // White title for contrast
                    fontSize: "14px",
                  },
                },
                labels: {
                  style: {
                    colors: "#ffffff", // White labels for contrast
                    fontSize: "12px",
                  },
                },
              },
              yaxis: {
                title: {
                  text: "Number of Emergency Alert",
                  style: {
                    color: "#ffffff", // White title for contrast
                    fontSize: "14px",
                  },
                },
                labels: {
                  style: {
                    colors: "#ffffff", // White labels for contrast
                    fontSize: "12px",
                  },
                  formatter: function (value) {
                    return Math.round(value); // Display whole numbers
                  },
                },
                min: 0, // Start y-axis at 0
                max: Math.max(...counts) + 2, // Dynamically set max value based on data
                tickAmount: 5, // Controls the number of ticks
              },
              title: {
                text: "Resident Health Stats",
                align: "center",
                style: {
                  color: "#ffffff", // White title for contrast
                  fontSize: "20px",  // Increased font size for better visibility
                  fontWeight: "bold",
                },
              },
              colors: ["#007BFF"], // Base color for the bars
              legend: {
                show: true,
                position: "top",
                horizontalAlign: "center",
                floating: true,
                labels: {
                  colors: "#ffffff", // White legend labels
                  useSeriesColors: true, // Match legend colors with the bars
                },
              },
              tooltip: {
                enabled: true,
                theme: "dark", // Dark theme for tooltip for consistency
                x: {
                  show: true,
                  format: "MMM", // Show month in tooltip
                },
                y: {
                  formatter: function (val) {
                    return val + " patients"; // Display number of patients in tooltip
                  },
                },
              },
            },
          });
        } else {
          console.error("No valid data received from the API");
          setError("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default PatientBarChart;
