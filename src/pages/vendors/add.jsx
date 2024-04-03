import { useState } from "react";
import NavBar from "../navbar";
import { useNavigate } from "react-router-dom";
import { SYSTEM_URL } from "../../global";
import logo from "../../sultani_logo.jpg";
import { useLocation } from "react-router-dom";

function AddFeedBackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [containerName, setContainerName] = useState("");
  const [welcomeLevel, setWelcomeLevel] = useState("");
  const [serviceLevel, setServiceLevel] = useState("");
  const [priceLevel, setPriceLevel] = useState("");
  const [foodLevel, setFoodLevel] = useState("");
  const [cleanLevel, setCleanLevel] = useState("");
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");

  function addFeedBack() {
    setLoading(true);

    fetch(SYSTEM_URL + "create_feedback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: JSON.stringify({
        welcome: welcomeLevel,
        service_level: serviceLevel,
        price_level: priceLevel,
        food_level: foodLevel,
        clean_level: cleanLevel,
        client_name: clientName,
        notes: 0,
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
        window.location.reload();
        // navigate("/create_feedback", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        alert(error + "😕");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const WelcomeRadiohandleChange = (e) => {
    const { name, value } = e.target;
    setWelcomeLevel(value);
  };
  const ServiceLevelRadiohandleChange = (e) => {
    const { name, value } = e.target;
    setServiceLevel(value);
  };
  const PriceLevelRadiohandleChange = (e) => {
    const { name, value } = e.target;
    setPriceLevel(value);
  };
  const FoodLevelRadiohandleChange = (e) => {
    const { name, value } = e.target;
    setFoodLevel(value);
  };
  const CleanLevelRadiohandleChange = (e) => {
    const { name, value } = e.target;
    setCleanLevel(value);
  };

  return (
    <>
      <NavBar />

      <div className="container-fluid text-center">
        <div className="container-fluid">
          <img src={logo} width={200} alt="" />

          <table
            id="table-with-background"
            className="table table-bordered table-striped table-hover"
          >
            <tbody>
              {/*  */}
              <tr>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="welcome"
                        id="welcome"
                        value="weak"
                        onChange={WelcomeRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ضعيف
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="welcome"
                        id="welcome"
                        value="good"
                        onChange={WelcomeRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        مقبول
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="welcome"
                        id="welcome"
                        value="very good"
                        onChange={WelcomeRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        جيد
                      </label>
                    </div>
                    <div className="p-2"></div>

                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="welcome"
                        id="welcome"
                        value="excellent"
                        onChange={WelcomeRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ممتاز
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <b> الاستقبال والترحيب</b>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="service_level"
                        id="service_level"
                        value="weak"
                        onChange={ServiceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ضعيف
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="service_level"
                        id="service_level"
                        value="good"
                        onChange={ServiceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        مقبول
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="service_level"
                        id="service_level"
                        value="very good"
                        onChange={ServiceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        جيد
                      </label>
                    </div>
                    <div className="p-2"></div>

                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="service_level"
                        id="service_level"
                        value="excellent"
                        onChange={ServiceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ممتاز
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <b> مستوى الخدمه</b>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="prive_level"
                        id="prive_level"
                        value="weak"
                        onChange={PriceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ضعيف
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="prive_level"
                        id="prive_level"
                        value="good"
                        onChange={PriceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        مقبول
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="prive_level"
                        id="prive_level"
                        value="very good"
                        onChange={PriceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        جيد
                      </label>
                    </div>
                    <div className="p-2"></div>

                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="prive_level"
                        id="prive_level"
                        value="excellent"
                        onChange={PriceLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ممتاز
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <b> مستوى الاسعار</b>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="food_level"
                        id="food_level"
                        value="weak"
                        onChange={FoodLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ضعيف
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="food_level"
                        id="food_level"
                        value="good"
                        onChange={FoodLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        مقبول
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="food_level"
                        id="food_level"
                        value="very good"
                        onChange={FoodLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        جيد
                      </label>
                    </div>
                    <div className="p-2"></div>

                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="food_level"
                        id="food_level"
                        value="excellent"
                        onChange={FoodLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ممتاز
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <b> جودة الطعام </b>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="clean_level"
                        id="clean_level"
                        value="weak"
                        onChange={CleanLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ضعيف
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="clean_level"
                        id="clean_level"
                        value="good"
                        onChange={CleanLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        مقبول
                      </label>
                    </div>

                    <div className="p-2"></div>
                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="clean_level"
                        id="clean_level"
                        value="very good"
                        onChange={CleanLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        جيد
                      </label>
                    </div>
                    <div className="p-2"></div>

                    <div>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="clean_level"
                        id="clean_level"
                        value="excellent"
                        onChange={CleanLevelRadiohandleChange}
                      />

                      <br />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        ممتاز
                      </label>
                    </div>
                  </div>
                </td>
                <td>
                  <b> مستوى النظافة</b>
                </td>
              </tr>
              <tr>
                <td>
                  <textarea
                    name=""
                    id=""
                    cols="60"
                    rows="5"
                    dir="rtl"
                    className="p-2"
                    style={{ border: "none" }}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  ></textarea>
                </td>
                <td>
                  <b> ملاحظات</b>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    onChange={(e) => {
                      setClientName(e.target.value);
                    }}
                    type="text"
                    className="form-control text-center border border-dark"
                    id="username"
                    style={{ fontSize: "20px" }}
                  />
                </td>
                <td>
                  <b> اسم الزبون</b>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            className="btn btn-success p-2 mt-2 mb-2"
            onClick={() => {
              if (
                welcomeLevel === "" ||
                serviceLevel === "" ||
                priceLevel === "" ||
                foodLevel === "" ||
                cleanLevel === ""
              ) {
                alert("الرجاء ادخال الاستبيان");
                return;
              }
              addFeedBack();
            }}
          >
            <h4> اضافة </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFeedBackPage;
