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
function ContainerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);

  const [totalDepositsDinar, setTotalDepositsDinar] = useState(0);
  const [totalDepositsDollar, setTotalDepositsDollar] = useState(0);

  const [totalWithdrawsDinar, setTotalWithdrawsDinar] = useState(0);
  const [totalWithdrawsDollar, setTotalWithdrawsDollar] = useState(0);

  async function loadDeposits() {
    setLoading(true);
    await fetch(SYSTEM_URL + "container_deposits/" + location.state.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalDepositsDinar(
          data.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price_in_dinar;
          }, 0)
        );

        setTotalDepositsDollar(
          data.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price_in_dollar;
          }, 0)
        );
        data.map((i) => {
          i.price_in_dinar = i.price_in_dinar.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.price_in_dollar = i.price_in_dollar.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.created_at = formatDate(new Date(i.created_at));
          i.company_name = i.company_name.title;
          i.container = i.container.name;
        });
        setDeposits(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const depositsColumns = [
    {
      dataField: "created_at",
      text: "تاريخ الانشاء",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "received_from",
      text: "استلام من",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "description",
      text: "التفاصيل",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "price_in_dollar",
      text: "مبلغ الدولار",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "price_in_dinar",
      text: "مبلغ الدينار",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "company_name",
      text: "اسم الشركة",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "container",
      text: "القاصة",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "invoice_id",
      text: "تسلسل السجل",
      sort: true,
      filter: textFilter(),
    },
  ];

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

  async function loadWithdraws() {
    setLoading(true);
    await fetch(SYSTEM_URL + "container_withdraws/" + location.state.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalWithdrawsDinar(
          data.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price_in_dinar;
          }, 0)
        );

        setTotalWithdrawsDollar(
          data.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.price_in_dollar;
          }, 0)
        );

        data.map((i) => {
          i.price_in_dinar = i.price_in_dinar.toLocaleString("en-US", {
            style: "currency",
            currency: "IQD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.price_in_dollar = i.price_in_dollar.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          i.created_at = formatDate(new Date(i.created_at));
          i.company_name = i.company_name.title;
          i.container = i.container.name;
          i.withdraw_type = i.withdraw_type.title;
        });
        setWithdraws(data);
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);
  }
  const withdrawsColumns = [
    {
      dataField: "created_at",
      text: "تاريخ الانشاء",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "description",
      text: "التفاصيل",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "price_in_dollar",
      text: "مبلغ الدولار",
      sort: true,
      filter: textFilter(),
    },

    {
      dataField: "price_in_dinar",
      text: "مبلغ الدينار",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "withdraw_type",
      text: "السيد",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "out_to",
      text: "الي",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "company_name",
      text: "اسم الشركة",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "container",
      text: "القاصة",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "invoice_id",
      text: "تسلسل السجل",
      sort: true,
      filter: textFilter(),
    },
  ];

  const rowDepositEvents = {
    onClick: (e, row, rowIndex) => {
      navigate("/deposit_details", {
        state: {
          invoice_id: row.invoice_id,
          container: row.container,
          company_name: row.company_name,
          price_in_dinar: row.price_in_dinar,
          price_in_dollar: row.price_in_dollar,
          description: row.description,
          received_from: row.received_from,
          created_at: row.created_at,
        },
      });
    },
  };

  const rowWithdrawEvents = {
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
  useEffect(() => {
    loadDeposits();
    loadWithdraws();
  }, []);
  return (
    <>
      <NavBar />
      <div className="container text-center p-2 " style={{ fontSize: "24px" }}>
        <h1 style={{ fontWeight: "bold" }}>{location.state.name} </h1>
      </div>

      <div className="container">
        <table className="table table-sm  table-strpied text-center">
          <thead>
            <tr>
              <td style={{ fontSize: "20px" }}>
                {(totalDepositsDinar - totalWithdrawsDinar).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "IQD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>
              <td className="text-start" style={{ fontSize: "20px" }}>
                ربح الدينار
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: "20px" }}>
                {" "}
                {(totalDepositsDollar - totalWithdrawsDollar).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>
              <td className="text-start" style={{ fontSize: "20px" }}>
                {" "}
                ربح الدولار{" "}
              </td>
            </tr>
          </thead>
        </table>
      </div>

      <hr />
      <div className="container text-center">
        <h1 className="text-success "> الايداعات</h1>
        <table className="table table-strpied table-hover ">
          <tbody>
            <tr>
              <td className="text-end">
                {totalDepositsDinar.toLocaleString("en-US", {
                  style: "currency",
                  currency: "IQD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>مجموع الدينار</td>
            </tr>
            <tr>
              <td className="text-end">
                {totalDepositsDollar.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>مجموع الدولار</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container-fluid" style={{ overflowX: "auto" }}>
        <BootstrapTable
          className="text-center"
          hover={true}
          bordered={true}
          bootstrap4
          keyField="id"
          columns={depositsColumns}
          data={deposits}
          pagination={pagination}
          filter={filterFactory()}
          rowEvents={rowDepositEvents}
        />
      </div>

      <hr />
      <div className="container text-center">
        <h1 className="text-danger"> الصرفيات</h1>
        <table className="table table-strpied table-hover ">
          <tbody>
            <tr>
              <td className="text-end">
                {totalWithdrawsDinar.toLocaleString("en-US", {
                  style: "currency",
                  currency: "IQD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>مجموع الدينار</td>
            </tr>
            <tr>
              <td className="text-end">
                {totalWithdrawsDollar.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>مجموع الدولار</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container-fluid" style={{ overflowX: "auto" }}>
        <BootstrapTable
          className="text-center"
          hover={true}
          bordered={true}
          bootstrap4
          keyField="id"
          columns={withdrawsColumns}
          data={withdraws}
          pagination={pagination}
          filter={filterFactory()}
          rowEvents={rowWithdrawEvents}
        />
      </div>
    </>
  );
}
export default ContainerDetailsPage;
