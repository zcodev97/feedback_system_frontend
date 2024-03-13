import { useState } from "react";
import NavBar from "../navbar";
import { useNavigate } from "react-router-dom";
import { SYSTEM_URL } from "../../global";

function AddContainerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [containerName, setContainerName] = useState("");
  const [totalDinar, setTotalDinar] = useState(0);
  const [totalDollar, setTotalDollar] = useState(0);

  function addContainer() {
    // if (window.confirm("هل انت متاكد ؟") == true) {

    // } else {
    //   alert("لقد الغيت عملية الأضافة");
    // }

    setLoading(true);

    fetch(SYSTEM_URL + "containers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify({
        name: containerName,
        total_dinar: 0,
        total_dollar: 0,
        created_by: localStorage.getItem("user_id"),
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return {};
      })
      .then((data) => {
        alert("تم اضافة سجل ");
        navigate("/containers", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        alert(error + "😕");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <NavBar />

      <div className="container-fluid text-center">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <td className="text-light bg-dark">
                <h3>الادخال</h3>
              </td>
              <td className="text-light bg-dark">
                <h3>العنوان</h3>
              </td>
            </tr>
          </thead>

          <tbody>
            {/*  */}
            <tr>
              <td>
                <input
                  onChange={(e) => {
                    setContainerName(e.target.value);
                  }}
                  type="text"
                  className="form-control text-center border border-dark"
                  id="username"
                  style={{ fontSize: "20px" }}
                />
              </td>
              <td>
                <b> آسم القاصة</b>
              </td>
            </tr>
            {/*  */}
            {/*  */}
            {/* <tr>
              <td>
                <input
                  onChange={(e) => {
                    setTotalDinar(e.target.value);
                  }}
                  type="number"
                  className="form-control text-center border border-dark"
                  id="username"
                  style={{ fontSize: "20px" }}
                />
              </td>
              <td>
                <b> مبلغ الدينار</b>
              </td>
            </tr> */}
            {/*  */}
            {/* <tr>
              <td>
                <input
                  onChange={(e) => {
                    setTotalDollar(e.target.value);
                  }}
                  type="number"
                  className="form-control text-center border border-dark"
                  id="username"
                  style={{ fontSize: "20px" }}
                />
              </td>
              <td>
                <b> مبلغ الدولار</b>
              </td>
            </tr> */}
            {/*  */}
          </tbody>
        </table>
        <div className="row">
          <div className="col-md-6">
            <div
              className="btn btn-danger p-2 mt-2 mb-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              <h4> رجوع 🔙</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="btn btn-success p-2 mt-2 mb-2"
              onClick={() => {
                if (containerName.length === 0) {
                  alert("أسم القاصة !");
                  return;
                }
                addContainer();
              }}
            >
              <h4> حفظ القيد</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddContainerPage;
