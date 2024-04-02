import { useEffect, useRef, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import NavBar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

function PaymentDetialsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const exportToPDF = () => {
    // Save the current document title
    const originalTitle = document.title;

    // Set the document title to the custom title
    document.title = ` حسابات مطعم   -  ${formatDate(
      start_date
    )} - ${formatDate(end_date)}.pdf`;
    window.print();

    window.addEventListener("afterprint", () => {
      document.title = originalTitle;
    });
  };

  const previousData = location.state.data;
  const start_date = location.state.startDate;
  const end_date = location.state.endDate;

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: location.state.row.orders.length,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

  const vendorPaymentsColumns = [
    // {
    //   dataField: "cancellation_reason",
    //   text: "cancellation_reason",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "cancellation_type",
    //   text: "cancellation_type",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "commission_percentage",
    //   text: "commission_percentage",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "commission_value",
    //   text: "commission_value",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "hybrid_payment",
    //   text: "hybrid_payment",
    //   sort: true,
    //   filter: textFilter(),
    // },
    // {
    //   dataField: "lastStatus",
    //   text: "lastStatus",
    //   sort: true,
    //   filter: textFilter(),
    // },
    {
      dataField: "order_id",
      text: "order_id",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "subtotal",
      text: "subtotal",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "order_date",
      text: "order_date",
      sort: true,
      filter: textFilter(),
    },
    // {
    //   dataField: "refund",
    //   text: "refund",
    //   sort: true,
    //   filter: textFilter(),
    // },

    // {
    //   dataField: "to_be_paid",
    //   text: "to_be_paid",
    //   sort: true,
    //   // filter: textFilter(),
    // },
    // {
    //   dataField: "total_discount",
    //   text: "total_discount",
    //   sort: true,
    //   // filter: textFilter(),
    // },
    // {
    //   dataField: "vendor",
    //   text: "vendor",
    //   sort: true,
    //   // filter: textFilter(),
    // },

    // {
    //   dataField: "vendor_discount",
    //   text: "vendor_discount ",
    //   sort: true,
    //   // filter: textFilter(),
    // },
    // {
    //   dataField: "vendor_discount_cap",
    //   text: "vendor_discount_cap",
    //   sort: true,
    //   // filter: textFilter(),
    // },
  ];

  location.state.row.orders?.map((i) => {
    // i.to_be_paid = i.to_be_paid?.toLocaleString("en-US", {
    //   style: "currency",
    //   currency: "IQD",
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 2,
    // });
    // i.refund = i.refund?.toLocaleString("en-US", {
    //   style: "currency",
    //   currency: "IQD",
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 2,
    // });
    i.subtotal = i.subtotal?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    i.order_date = formatDate(new Date(i.order_date));
    // i.date_from = formatDate(new Date(i.date_from));
    // i.date_to = formatDate(new Date(i.date_to));
    // i.payment_cycle = i.payment_cycle.title;
    // i.payment_method = i.payment_method.title;
  });

  return (
    <>
      <NavBar />

      <div className="container-fluid">
        <button
          className="btn btn-danger m-2"
          onClick={() => {
            navigate("/payments", {
              replace: true,
              state: {
                data: previousData,
                start_date: start_date,
                end_date: end_date,
              },
            });
          }}
          id="no-print"
        >
          back
        </button>

        {/* <div
          className="btn btn-warning text-dark border border-2 border-warning text-dark m-2"
          onClick={() => {
            exportToPDF();
          }}
          id="no-print"
        >
          <b>Download</b>
        </div> */}
      </div>

      <div className="container-fluid d-flex mt-2 mb-2">
        <div className="container text-center d-flex">
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {location.state.row.vendor}
          </p>
        </div>

        <div className="container text-center">
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {location.state.row.start_date} to {location.state.row.end_date}
          </p>
        </div>
        <div className="container text-center">
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {location.state.row.vendor_id}
          </p>
        </div>
      </div>

      <div className="container-fluid" style={{ overflowX: "auto" }}>
        <div
          className="container-fluid text-center"
          style={{
            overflowX: "auto",
            width: "100%",
            fontSize: "16px",
          }}
        >
          <BootstrapTable
            className="text-center"
            hover={true}
            bordered={false}
            striped={true}
            bootstrap4
            keyField="id"
            columns={vendorPaymentsColumns}
            data={location.state.row.orders}
            pagination={pagination}
            // rowEvents={rowEvents}
            filter={filterFactory()}
          />
        </div>
      </div>
    </>
  );
}
export default PaymentDetialsPage;
