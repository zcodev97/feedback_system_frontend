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
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  const exportToPDF = () => {
    // Save the current document title
    const originalTitle = document.title;

    // Set the document title to the custom title
    document.title = ` حسابات مطاعم   -  ${formatDate(
      startDate
    )} - ${formatDate(endDate)}.pdf`;
    window.print();

    window.addEventListener("afterprint", () => {
      document.title = originalTitle;
    });
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: data?.length,
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
        response.results?.forEach((i) => {
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
        response.results?.forEach((i) => {
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

  async function payAllVendors() {
    setLoading(true);

    console.log(filteredData);
    if (filteredData.length !== 0) {
      try {
        const response = await fetch(SYSTEM_URL + "create_payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(filteredData),
        });

        const responseData = await response.json();

        if (response.ok) {
          console.log("Data saved successfully");
        } else {
          console.error("Failed to save data:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }

      setLoading(false);

      navigate("/paid_vendors", { replace: true });
    }
    setLoading(false);
  }

  async function loadPaymentForGivenDate() {
    setLoading(true);
    setFilteredData([]);
    setData([]);
    setSelectedPaymentCycle("");
    setSelectedVendor("");
    setSelectedPaymentMethod("");
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
        // console.log(data);

        // if (data.code === "token_not_valid") {
        //   navigate("/login", { replace: true });
        // }

        data = data.filter((i) => i.orders.length > 0);
        if (data.length > 0) {
          data.map((i) => {
            i.to_be_paid = i.to_be_paid.toLocaleString("en-US", {
              style: "currency",
              currency: "IQD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
            i.is_paid = i.is_paid ? true : false;
            i.created_by = localStorage.getItem("user_id");
            i.is_paid = true;

            dropdownMenuVendorsTemp.push({
              label: i.vendor,
              value: i.vendor_id,
            });
          });

          setVendorsDropDownMenu(dropdownMenuVendorsTemp);

          setData(data);
          setFilteredData(data);
        } else {
          alert("No Orders Found With Given Period");
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadPaymentsMethod();
    loadPaymentsCycle();
    // loadVendors();

    if (location?.state?.data.length > 0) {
      setData(location?.state?.data);
      setStartDate(location?.state?.start_date);
      setEndDate(location?.state?.end_date);
    }
  }, []);

  function handleVendorFilter(opt) {
    setLoading(true);

    let filtered = data;

    filtered = filtered.filter((item) => item.vendor_id === opt.value);

    setFilteredData(filtered);
    setLoading(false);
  }
  function handlePaymentMethodFilter(opt, selectedPaymentCycle) {
    setLoading(true);
    let filtered = data;

    if (selectedPaymentCycle) {
      filtered = data.filter(
        (item) =>
          item.pay_type === opt.label &&
          item.pay_period === selectedPaymentCycle.label
      );
      setFilteredData(filtered);
      setLoading(false);
      return;
    }

    filtered = filtered.filter((item) => item.pay_type === opt.label);

    setFilteredData(filtered);
    setLoading(false);
  }

  //
  function handlePaymentCycleFilter(opt, selectedPaymentMethod) {
    setLoading(true);

    let filtered = data;

    if (selectedPaymentMethod) {
      // console.log(selectedPaymentMethod);
      filtered = data.filter(
        (item) =>
          item.pay_period === opt.label &&
          item.pay_type === selectedPaymentMethod.label
      );
      setFilteredData(filtered);
      setLoading(false);
      return;
    }

    filtered = filtered.filter((item) => item.pay_period === opt.label);

    setFilteredData(filtered);
    setLoading(false);
  }

  return (
    <>
      <NavBar />

      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="container text-start mt-2 mb-2" id="no-print">
            <b className="text-danger" style={{ fontSize: "24px" }}>
              Payments
            </b>
          </div>

          <div
            className="container d-flex justify-content-center align-items-end mt-2 mb-2"
            style={{ width: "300px" }}
            id="no-print"
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

            <div className="container d-flex" id="no-print">
              <button
                className="btn btn-primary text-light m-1"
                onClick={loadPaymentForGivenDate}
              >
                <b> Get </b>
              </button>
              <div
                onClick={payAllVendors}
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
              >
                <pre className="btn btn-success text-light m-1">
                  <b>
                    Pay {(filteredData.length > 0 ? filteredData : data).length}
                    {(filteredData.length > 0 ? filteredData : data).length ===
                    1
                      ? " vendor"
                      : " vendors"}
                  </b>
                </pre>
              </div>
              <button
                className="btn btn-warning text-dark border border-2 border-warning text-dark m-1"
                onClick={() => {
                  exportToPDF();
                }}
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
              >
                <b>Download</b>
              </button>
            </div>
          </div>

          <div className="container-fluid d-flex mt-2 mb-2">
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Vendor
              <Select
                defaultValue={selectedVendor}
                options={vendorsDropDownMenu}
                onChange={(opt) => {
                  setSelectedVendor(opt);
                  handleVendorFilter(opt);
                }}
                value={selectedVendor}
              />
            </div>
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Payment Method
              <Select
                defaultValue={selectedPaymentMethod}
                options={paymentMethodDropDown}
                onChange={(opt) => {
                  handlePaymentMethodFilter(opt, selectedPaymentCycle);
                  setSelectedPaymentMethod(opt);
                }}
                value={selectedPaymentMethod}
              />
            </div>
            <div
              className="container "
              style={{
                display: data?.length > 0 ? "inline" : "none",
              }}
            >
              Payment Cycle
              <Select
                defaultValue={selectedPaymentCycle}
                options={paymentCycleDropDown}
                onChange={(opt) => {
                  handlePaymentCycleFilter(opt, selectedPaymentMethod);

                  setSelectedPaymentCycle(opt);
                }}
                value={selectedPaymentCycle}
              />
            </div>
            <div className="container  d-flex align-items-end justify-content-center">
              <div
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
                className="btn btn-danger"
                onClick={() => {
                  setLoading(true);
                  setFilteredData([]);
                  setSelectedPaymentCycle("");
                  setSelectedVendor("");
                  setSelectedPaymentMethod("");
                  setLoading(false);
                }}
                id="no-print"
              >
                Clear Filters
              </div>
            </div>
          </div>

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "12px",
            }}
          >
            <div
              className="text-dark text-start mt -2 mb-2"
              style={{ fontSize: "20px" }}
            >
              <b>
                {(filteredData.length > 0 ? filteredData : data).length} Vendors
              </b>
            </div>
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr
                  className="bg-dark text-light"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  <td>Vendor ID</td>
                  <td>Vendor</td>
                  <td>To Be Paid</td>
                  <td>Order Count</td>
                  <td>Number</td>
                  <td>Penalized </td>
                  <td>Fully Refunded</td>
                  <td>Pay Period</td>
                  <td>Pay Type</td>
                  <td>Start Date</td>
                  <td>End Date</td>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {(filteredData.length > 0 ? filteredData : data).legnth === 0
                  ? ""
                  : Object?.values(
                      filteredData.length > 0 ? filteredData : data
                    )?.map((i) => (
                      <tr>
                        <td>{i.vendor_id}</td>
                        <td>{i.vendor}</td>
                        <td>{i.to_be_paid}</td>
                        <td>{i.order_count}</td>
                        <td>{i.number}</td>
                        <td>{i.penalized ? "true" : "false"}</td>
                        <td>{i.fully_refunded ? "true" : "false"}</td>
                        <td>{i.pay_period}</td>
                        <td>{i.pay_type}</td>
                        <td>{i.start_date}</td>
                        <td>{i.end_date}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
export default PaymentsPage;
