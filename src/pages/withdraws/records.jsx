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

  const [withdraws, setWithdraws] = useState([]);

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
      navigate("/withdraw_details", {
        state: {
          invoice_id: row.invoice_id,
          container: row.container,
          company_name: row.company_name,
          price_in_dinar: row.price_in_dinar,
          price_in_dollar: row.price_in_dollar,
          description: row.description,
          withdraw_type: row.withdraw_type,
          created_at: row.created_at,
          out_to: row.out_to,
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

  async function loadAdminWithdraws() {
    setLoading(true);
    await fetch(SYSTEM_URL + "payments/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.map((i) => {
          i.amount = i.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.created_at = formatDate(new Date(i.created_at));
          i.date_from = formatDate(new Date(i.date_from));
          i.date_to = formatDate(new Date(i.date_to));
          i.payment_cycle = i.payment_cycle.title;
          i.payment_method = i.payment_method.title;
        });
        setWithdraws(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const withdrawsColumns = [
    {
      dataField: "created_by",
      text: "created_by",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "created_at",
      text: "created_at",
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
      text: "date_to",
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
      dataField: "vendor_name",
      text: "vendor_name ",
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
    loadPaymentsMethod();
    loadPaymentsCycle();
    loadVendors();
    loadAdminWithdraws();
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

          <div className="container-fluid" style={{ overflowX: "auto" }}>
            <BootstrapTable
              className="text-center"
              hover={true}
              bordered={false}
              bootstrap4
              keyField="id"
              columns={withdrawsColumns}
              data={withdraws}
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
