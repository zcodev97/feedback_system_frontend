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
function PaymentsPage() {
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
      navigate("/payment_details", {
        state: {
          row: row,
          data: data,
          startDate: startDate,
          endDate: endDate,
        },
      });
    },
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [paymentMethodDropDown, setpaymentMethodDropDown] = useState([]);
  let dropdownMenupaymentmethodTemp = [];
  async function loadPaymentsMethod() {
    setLoading(true);

    fetch(SYSTEM_URL + "payment_methods/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        response.forEach((i) => {
          dropdownMenupaymentmethodTemp.push({
            label: i.title,
            value: i.id,
          });
        });
        setpaymentMethodDropDown(dropdownMenupaymentmethodTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedPaymentCycle, setSelectedPaymentCycle] = useState({});
  const [paymentCycleDropDown, setpaymentCycleDropDown] = useState([]);
  let dropdownMenupaymentcyclesTemp = [];
  async function loadPaymentsCycle() {
    setLoading(true);

    fetch(SYSTEM_URL + "payment_cycles/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response.forEach((i) => {
          dropdownMenupaymentcyclesTemp.push({
            label: i.title,
            value: i.id,
          });
        });
        setpaymentCycleDropDown(dropdownMenupaymentcyclesTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [selectedVendor, setSelectedVendor] = useState({});
  const [vendorsDropDownMenu, setVendorsDropDownMenu] = useState([]);
  let dropdownMenuVendorsTemp = [];
  async function loadVendors() {
    setLoading(true);

    fetch(SYSTEM_URL + "vendors/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        response.forEach((i) => {
          dropdownMenuVendorsTemp.push({
            label: i.name,
            value: i.id,
          });
        });
        setVendorsDropDownMenu(dropdownMenuVendorsTemp);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function payAllVendors() {
    setLoading(true);
    data?.map(async (i) => {
      let paymentCycleID = paymentCycleDropDown.filter(
        (j) => j.label === i.pay_period
      )[0]?.value;

      let paymentMethodID = paymentMethodDropDown.filter(
        (j) => j.label === i.pay_type
      )[0]?.value;

      await fetch(SYSTEM_URL + "create_payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          vendor_id: i.vendor_id,
          vendor: i.vendor,
          date_from: formatDate(i.start_date),
          date_to: formatDate(i.end_date),
          number: i.number,
          amount: i.to_be_paid,
          is_paid: true,
          orders: i.orders,
          orders_count: i.order_count,
          payment_cycle: paymentCycleID,
          payment_method: paymentMethodID,

          created_by: localStorage.getItem("user_id"),
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          alert(error + "😕");
        });
    });
    setLoading(false);
  }

  async function loadPaymentForGivenDate() {
    setLoading(true);
    await fetch(
      SYSTEM_URL +
        `vendor-payments-summary/?start_date=${formatDate(
          startDate
        )}&end_date=${formatDate(endDate)}`,
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
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        // console.log(data);
        data.map((i) => {
          i.to_be_paid = i.to_be_paid.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.is_paid = i.is_paid ? true : false;
          // i.date_from = formatDate(new Date(i.date_from));
          // i.date_to = formatDate(new Date(i.date_to));
          // i.payment_cycle = i.payment_cycle.title;
          // i.payment_method = i.payment_method.title;
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
      // filter: textFilter(),
    },
    {
      dataField: "order_count",
      text: "order_count",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "to_be_paid",
      text: "to_be_paid",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "penalized",
      text: "penalized",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "fully_refunded",
      text: "fully_refunded",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "number",
      text: "number",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "pay_period",
      text: "pay_period",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "pay_type",
      text: "pay_type",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "end_date",
      text: "end_date ",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "start_date",
      text: "start_date",
      sort: true,
      // filter: textFilter(),
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
      // filter: textFilter(),
    },
  ];
  useEffect(() => {
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadVendors();

    if (location?.state?.data.length > 0) {
      setData(location?.state?.data);
      setStartDate(location?.state?.start_date);
      setEndDate(location?.state?.end_date);
    }

    // loadPaymentForGivenDate();
  }, []);
  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container text-center">
            <h1 className="text-danger "> Payments</h1>
          </div>
          <div className="container d-flex mt-2 mb-2">
            <div className="container ">
              Vendor
              <Select
                defaultValue={selectedVendor}
                options={vendorsDropDownMenu}
                onChange={(opt) => setSelectedVendor(opt)}
                placeholder={"Vendor"}
              />
            </div>
            <div className="container ">
              Payment Method
              <Select
                defaultValue={selectedPaymentMethod}
                options={paymentMethodDropDown}
                onChange={(opt) => setSelectedPaymentMethod(opt)}
                placeholder={"Payment Method"}
              />
            </div>
            <div className="container ">
              Payment Cycle
              <Select
                defaultValue={selectedPaymentCycle}
                options={paymentCycleDropDown}
                onChange={(opt) => setSelectedPaymentCycle(opt)}
                placeholder={"Payment Cycle"}
              />
            </div>
          </div>

          <div
            className="container d-flex mt-2 mb-2"
            style={{ width: "300px" }}
          >
            <div className="container">
              Start Date
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setStartDate}
                value={startDate}
              />
            </div>

            <div className="container">
              End Date
              <DateTimePicker
                key={1}
                clearIcon={null}
                format={"y-MM-dd"}
                onChange={setEndDate}
                value={endDate}
              />
            </div>
          </div>

          <div
            className="container text-center d-flex
          justify-content-center
          align-items-center
          "
          >
            <button
              className="btn btn-light text-dark m-1"
              onClick={loadPaymentForGivenDate}
            >
              <b> Get Orders</b>
            </button>

            <button
              className="btn btn-light text-success  m-1"
              onClick={payAllVendors}
            >
              <b> Pay All Vendors </b>
            </button>
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
export default PaymentsPage;
