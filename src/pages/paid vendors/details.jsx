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

function PaidVendorOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const previousData = location.state.data;
  const start_date = location.state.startDate;
  const end_date = location.state.endDate;

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

  const vendorPaymentsColumns = [
    // {
    //   dataField: "cancellation_reason",
    //   text: "cancellation_reason",
    //   sort: true,
    // filter: textFilter(),
    // },
    // {
    //   dataField: "cancellation_type",
    //   text: "cancellation_type",
    //   sort: true,
    // filter: textFilter(),
    // },
    // {
    //   dataField: "commission_percentage",
    //   text: "commission_percentage",
    //   sort: true,
    // filter: textFilter(),
    // },
    // {
    //   dataField: "commission_value",
    //   text: "commission_value",
    //   sort: true,
    // filter: textFilter(),
    // },
    // {
    //   dataField: "hybrid_payment",
    //   text: "hybrid_payment",
    //   sort: true,
    // filter: textFilter(),
    // },
    // {
    //   dataField: "lastStatus",
    //   text: "lastStatus",
    //   sort: true,
    // filter: textFilter(),
    // },
    {
      dataField: "order_id",
      text: "order_id",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "order_date",
      text: "order_date",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "refund",
      text: "refund",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "subtotal",
      text: "subtotal",
      sort: true,
      // filter: textFilter(),
    },

    {
      dataField: "total_discount",
      text: "total_discount",
      sort: true,
      // filter: textFilter(),
    },
    {
      dataField: "vendor_discount",
      text: "vendor_discount ",
      sort: true,
      // filter: textFilter(),
    },
    // {
    //   dataField: "vendor_discount_cap",
    //   text: "vendor_discount_cap",
    //   sort: true,
    //   filter: textFilter(),
    // },
    {
      dataField: "to_be_paid",
      text: "to_be_paid",
      sort: true,
      // filter: textFilter(),
    },
  ];

  // console.log(location.state.row.orders);

  location.state.row.orders?.map((i) => {
    i.to_be_paid = i.to_be_paid?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    i.refund = i.refund?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    i.subtotal = i.subtotal?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    i.vendor_discount = i.vendor_discount?.toLocaleString("en-US", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    i.total_discount = i.total_discount?.toLocaleString("en-US", {
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

      <div className="container-fluid" style={{ overflowX: "auto" }}>
        <div
          className="container-fluid text-center"
          style={{ overflowX: "auto" }}
        >
          <div className="container text-center" style={{ fontSize: "20px" }}>
            <p>
              {" "}
              Paid Orders For Vendor <b> {location.state.row.vendor} </b>{" "}
            </p>
            <hr />
            <p>
              {location.state.row.date_from} <b>to </b>{" "}
              {location.state.row.date_to}
            </p>
          </div>
          <hr />

          <BootstrapTable
            className="text-center"
            hover={true}
            bordered={false}
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
export default PaidVendorOrdersPage;
