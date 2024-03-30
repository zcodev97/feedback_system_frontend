import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import Loading from "../loading";
import NavBar from "../navbar";
import axios from "axios";

function VendorsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [totalDinar, setTotalDinar] = useState(0);
  const [totalDollar, setTotalDollar] = useState(0);

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        SYSTEM_URL + "upload_vendors_as_excel/",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  async function loadData() {
    setLoading(true);
    await fetch(SYSTEM_URL + "vendors/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        // console.log(data[0]);
        data.results?.map((i) => {
          i.created_at = formatDate(new Date(i.created_at));
          i.pay_period = i.pay_period.title;
          i.pay_type = i.pay_type.title;
        });

        setData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      dataField: "account_manager",
      text: "account_manager",
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
      dataField: "penalized",
      text: "penalized",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "fully_refunded",
      text: "fully_refunded",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "owner_phone",
      text: "owner_phone",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "owner_name",
      text: "owner_name",
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
      dataField: "pay_type",
      text: "pay_type",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "pay_period",
      text: "pay_period",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "name",
      text: "name",
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

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/container_details", {
        state: {
          id: row.id,
          name: row.name,
          total_dinar: row.total_dinar,
          total_dollar: row.total_dollar,
        },
      });
    },
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
  });

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
          <div className="container text-center ">
            <h1> Vendors</h1>
          </div>

          <div className="container mt-2 mb-2 text-center d-flex">
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </form>
            <button
              className="btn btn-light rounded"
              type="submit"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>

          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <table className="table table-sm">
              <BootstrapTable
                className="text-center"
                hover={true}
                bordered={false}
                keyField="id"
                columns={columns}
                data={data}
                pagination={pagination}
                filter={filterFactory()}
                // rowEvents={rowEvents}
              />
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorsPage;
