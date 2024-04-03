import { useState } from "react";
import NavBar from "../navbar";
import { useNavigate } from "react-router-dom";
import { SYSTEM_URL, formatDate } from "../../global";
import Loading from "../loading";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FeedBackReportsPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState([]);

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: "red",
          font: {
            size: 20,
          },
        },
      },
      x: {
        ticks: {
          color: "blue",
          font: {
            size: 20,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          fontSize: 30, // Adjust font size as desired (in pixels)
        },
      },
      title: {
        display: true,
        text: "تقرير",
      },
    },
  };

  const labels = [
    "الترحيب والاستقبال",
    "مستوى الخدمه",
    "جودة الطعام",
    "مستوى الاسعار",
    "مستوى النظافة",
  ];

  let data = {
    labels,

    datasets: [
      {
        label: "ممتاز",
        data: [
          reportData.filter((i) => i.welcome === "excellent").length,
          reportData.filter((i) => i.service_level === "excellent").length,
          reportData.filter((i) => i.food_level === "excellent").length,
          reportData.filter((i) => i.price_level === "excellent").length,
          reportData.filter((i) => i.clean_level === "excellent").length,
        ],
        backgroundColor: "green",
      },
      {
        label: "جيد",
        data: [
          reportData.filter((i) => i.welcome === "very good").length,
          reportData.filter((i) => i.service_level === "very good").length,
          reportData.filter((i) => i.food_level === "very good").length,
          reportData.filter((i) => i.price_level === "very good").length,
          reportData.filter((i) => i.clean_level === "very good").length,
        ],
        backgroundColor: "blue",
      },
      {
        label: "مقبول",
        data: [
          reportData.filter((i) => i.welcome === "good").length,
          reportData.filter((i) => i.service_level === "good").length,
          reportData.filter((i) => i.food_level === "good").length,
          reportData.filter((i) => i.price_level === "good").length,
          reportData.filter((i) => i.clean_level === "good").length,
        ],
        backgroundColor: "lightblue",
      },
      {
        label: "ضعيف",

        data: [
          reportData.filter((i) => i.welcome === "weak").length,
          reportData.filter((i) => i.service_level === "weak").length,
          reportData.filter((i) => i.food_level === "weak").length,
          reportData.filter((i) => i.price_level === "weak").length,
          reportData.filter((i) => i.clean_level === "weak").length,
        ],
        backgroundColor: "tomato",
      },
    ],
  };

  async function loadData() {
    setLoading(true);
    await fetch(
      SYSTEM_URL +
        `report_feedback/?date_from=${formatDate(
          startDate
        )}&date_to=${formatDate(endDate)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }

        console.log(data);
        console.log(data.length);
        console.log(data.filter((i) => i.food_level === "weak").length);
        console.log(data.length);

        setReportData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <NavBar />
      {loading ? (
        <Loading />
      ) : (
        <div
          className="container-fluid"
          style={{ margin: "0px", padding: "0px" }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <button className="btn" onClick={loadData}>
                get report
              </button>
            </div>
            <DateTimePicker
              key={2}
              clearIcon={null}
              format={"y-MM-dd"}
              onChange={setEndDate}
              value={endDate}
            />

            <div className="p-3 text-center"> الى</div>
            <DateTimePicker
              key={1}
              clearIcon={null}
              format={"y-MM-dd"}
              onChange={setStartDate}
              value={startDate}
            />

            <div className="p-3 text-center"> من</div>
          </div>

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <div className="container mt-2 mb-5" style={{ overflowX: "auto" }}>
              <Bar options={options} data={data} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedBackReportsPage;
