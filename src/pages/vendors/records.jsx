import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SYSTEM_URL, formatDate } from "../../global";
import Loading from "../loading";
import NavBar from "../navbar";

function FeedbackRecordsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 15;

  async function loadData(page = 1) {
    setLoading(true);
    await fetch(SYSTEM_URL + `feedbacks/?page=${page}`, {
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

        setData(data);
        setPaginatedData(data.results);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    setLoading(true);
    loadData();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setLoading(false);
  }, []);

  const totalPages = Math.ceil(data.count / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadData(page);

      setCurrentPage(page);
    }
  };

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
            className="container-fluid text-end mt-2 mb-2"
            style={{ fontSize: "34px" }}
          >
            <b> الادخالات</b>
          </div>
          <hr />
          <div
            className="container-fluid text-center"
            style={{
              overflowX: "auto",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <div className="container-fluid " style={{ overflowX: "auto" }}>
              <table
                className="table table-striped table-sm table-hover"
                style={{ fontSize: "18px" }}
              >
                <tfoot className="mt-3 ">
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {data.count} العدد الكلي
                  </p>
                </tfoot>
                <thead>
                  <tr>
                    <th> تاريخ الانشاء</th>
                    <th> اسم الزبون</th>
                    <th> رقم الزبون</th>
                    <th> ملاحظات</th>
                    <th>مستوى النظافة</th>
                    {/* <th>ملاحظات </th> */}
                    <th>جودة الطعام</th>
                    {/* <th>ملاحظات </th> */}
                    <th>مستوى الاسعار</th>
                    {/* <th>ملاحظات</th> */}
                    <th>مستوى الخدمة</th>
                    {/* <th>ملاحظات</th> */}
                    <th> الاستقبال والترحيب </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((i) => (
                    <tr key={Math.random() * 10}>
                      <td>{formatDate(i.created_at)}</td>
                      <td>{i.client_name}</td>
                      <td>{i.client_number}</td>
                      <td>{i.notes}</td>
                      <td>
                        {i.clean_level === "excellent"
                          ? "ممتاز"
                          : i.clean_level === "very good"
                          ? "جيد"
                          : i.clean_level === "good"
                          ? "مقبول"
                          : "ضعيف"}
                      </td>

                      <td>
                        {i.food_level === "excellent"
                          ? "ممتاز"
                          : i.food_level === "very good"
                          ? "جيد"
                          : i.food_level === "good"
                          ? "مقبول"
                          : "ضعيف"}
                      </td>
                      <td>
                        {i.price_level === "excellent"
                          ? "ممتاز"
                          : i.price_level === "very good"
                          ? "جيد"
                          : i.price_level === "good"
                          ? "مقبول"
                          : "ضعيف"}
                      </td>

                      <td>
                        {i.service_level === "excellent"
                          ? "ممتاز"
                          : i.service_level === "very good"
                          ? "جيد"
                          : i.service_level === "good"
                          ? "مقبول"
                          : "ضعيف"}
                      </td>
                      <td>
                        {i.welcome === "excellent"
                          ? "ممتاز"
                          : i.welcome === "very good"
                          ? "جيد"
                          : i.welcome === "good"
                          ? "مقبول"
                          : "ضعيف"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => changePage(1)}
                >
                  &laquo; اول صفحة
                </button>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => changePage(currentPage - 1)}
                >
                  &lsaquo; السابق
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => changePage(currentPage + 1)}
                >
                  التالي &rsaquo;
                </button>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => changePage(totalPages)}
                >
                  اخر صفحة &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackRecordsPage;
