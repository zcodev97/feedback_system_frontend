import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Select from "react-select";
import Loading from "../loading";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
function PaidVendorsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [data, setData] = useState([]);

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/paid_vendor_orders_details", {
        state: {
          row: row,
        },
      });
    },
  };

  async function loadAllPayments() {
    setLoading(true);
    await fetch(SYSTEM_URL + `payments/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }

        // console.log(data);

        data?.map((i) => {
          i.amount = i.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.date_from = formatDate(i.date_from);
          i.date_to = formatDate(i.date_to);

          i.is_paid = i.is_paid ? true : false;
          // i.date_from = formatDate(new Date(i.date_from));
          // i.date_to = formatDate(new Date(i.date_to));
          i.payment_cycle = i.payment_cycle.title;
          i.payment_method = i.payment_method.title;
        });

        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const vendorPaymentsColumns = [
    {
      dataField: "is_paid",
      text: "is_paid",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "orders_count",
      text: "orders_count",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "amount",
      text: "amount",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "number",
      text: "number",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "payment_method",
      text: "payment_method",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "payment_cycle",
      text: "payment_cycle",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "date_to",
      text: "date_to ",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "date_from",
      text: "date_from",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "vendor",
      text: "vendor",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "vendor_id",
      text: "vendor_id",
      sort: true,
      filter: textFilter(),
    },
  ];
  useEffect(() => {
    loadAllPayments();
  }, []);
  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container text-center">
            <h1 className="text-danger "> Paid Vendors </h1>
          </div>

          <div
            className="container-fluid text-center"
            style={{ overflowX: "auto" }}
          >
            <BootstrapTable
              className="text-center"
              hover={true}
              bordered={false}
              bootstrap4
              keyField="id"
              columns={vendorPaymentsColumns}
              data={data}
              pagination={pagination}
              rowEvents={rowEvents}
              filter={filterFactory()}
            />
          </div>
        </>
      )}
    </>
  );
}
export default PaidVendorsPage;
