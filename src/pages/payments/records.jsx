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
          // console.log(i);
          dropdownMenuVendorsTemp.push({
            label: i.name,
            value: i.vendor_id,
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

    // console.log(data);
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
        console.log(responseData);
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
        if (data.code === "token_not_valid") {
          navigate("/login", { replace: true });
        }
        // console.log(data);

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
          });
          console.log(data);
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
      // filter: textFilter(),
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
        <>
          <div className="container text-center" id="no-print">
            <h1 className="text-danger "> Payments</h1>
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

            <div className="container d-flex">
              <button
                className="btn btn-primary text-light m-1"
                onClick={loadPaymentForGivenDate}
                id="no-print"
              >
                <b> Get </b>
              </button>
              <button
                className="btn btn-success text-light m-1"
                onClick={payAllVendors}
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
                id="no-print"
              >
                <b>
                  <pre>
                    Pay {(filteredData.length > 0 ? filteredData : data).length}{" "}
                    {(filteredData.length > 0 ? filteredData : data).length ===
                    1
                      ? "vendor"
                      : "vendors"}
                  </pre>
                </b>
              </button>
              <button
                className="btn btn-warning text-dark border border-2 border-warning text-dark m-1"
                onClick={() => {
                  exportToPDF();
                }}
                style={{
                  display: data?.length > 0 ? "inline" : "none",
                }}
                id="no-print"
              >
                <b>Download</b>
              </button>
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
            {/* <BootstrapTable
                id="payment-table"
                hover={true}
                bordered={false}
                bootstrap4
                striped={true}
                keyField="id"
                columns={vendorPaymentsColumns}
                data={filteredData.length > 0 ? filteredData : data}
                pagination={pagination}
                rowEvents={rowEvents}
                filter={filterFactory()}
              /> */}
            <div className="text-dark" style={{ fontSize: "20px" }}>
              {(filteredData.length > 0 ? filteredData : data).length} vendors
            </div>
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr
                  className="bg-dark text-light"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  {(filteredData.length > 0 ? filteredData : data).length === 0
                    ? ""
                    : Object?.keys(
                        filteredData.length > 0 ? filteredData[0] : data[0]
                      )
                        ?.filter(
                          (i) =>
                            i !== "orders" &&
                            i !== "is_paid" &&
                            i !== "created_by"
                        )
                        .map((i) => <td> {i} </td>)}

                  <td></td>
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
                        <td>{i.to_be_paid}</td>
                        <td>{i.order_count}</td>
                        <td>{i.vendor}</td>
                        <td>{i.number}</td>
                        <td>{i.penalized ? "true" : "false"}</td>
                        <td>{i.fully_refunded ? "true" : "false"}</td>
                        <td>{i.pay_period}</td>
                        <td>{i.pay_type}</td>
                        <td>{i.start_date}</td>
                        <td>{i.end_date}</td>
                        <td>
                          <div className="btn btn-success text-light">
                            <b>Pay</b>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
export default PaymentsPage;
