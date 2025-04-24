import axios from "axios";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";


export default function InventoryDashboard() {
  const [login, setLogin] = useState("BEC071002");
  const [data, setData] = useState([]);
  const [delete_, setDelete] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [modify, setModify] = useState({
    EmployeeId: login,
    Role: "",
    Scope: "",
    Support: "",
    Peroid: "",
    support_userid: null,
  });
  const [addrow, setAddRow] = useState({
    EmployeeId: login,
    Role: "",
    Scope: "",
    Support: "",
    Peroid: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/support?userid=${login}`)
      .then((res) => {
        setData(res.data);
        //console.log(data);hg
      })
      .then((err) => {
        // consougugihoijogugiygugi
      });
  }, [refresh]);
  const handleDelete = (e, index) => {
    console.log(data[index]);
    e.preventDefault();
    axios
      .delete(
        `http://localhost:8081/support?userid=${login}&EmplooyeId=${data[index].EmplooyeId}&Role=${data[index].Role}&Support=${data[index].Support}&Peroid=${data[index].Peroid}`
      )
      .then((res) => {
        console.log(res);
        setRefresh((prev) => prev + 1);
      })
      .then((err) => {
        console.log(err);
      });
  };
  ///
  const handleModify = (e, key) => {
    e.preventDefault();

    setModify((prev) => ({ ...prev, [key]: e.target.value }));
    console.log(modify);
  }; ///
  const handleSubmitModify = () => {
    console.log("fzdfg");
    axios
      .put("http://localhost:8081/support", modify)
      .then(
        (res) => console.log(res),
        setRefresh((prev) => prev + 1)
      )
      .then((err) => console.log(err));
  };
  ////
  const handleAdd = (e, key) => {
    e.preventDefault();
    setAddRow((prev) => ({ ...prev, [key]: e.target.value }));
  };
  ////////
  const handleSubmitAdd = () => {
    axios
      .post(`http://localhost:8081/support`, addrow)
      .then(
        (res) => console.log(res),
        setRefresh((prev) => prev + 1)
      )
      .then((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <h1>Support</h1>
      {data.map((id, index) => {
        return (
          <div key={index} className="profile">
            <b>EmplooyeId: </b>
            {id.EmployeeID}
            <br />
            <b>Role:</b> {id.Role} <br />
            <b> Scope:</b>
            {id.Scope}
            <br />
            <b>Support:</b> {id.Support}
            <br />
            <b>Peroid:</b> {id.Acc_Year}
            <Popup
              trigger={<input type="button" value="modify" />}
              modal
              nested
            >
              {(close) => (
                <>
                  <div className="popupdiv">
                    <table>
                      <tr>
                        <td>
                          <input
                            type="text"
                            defaultValue={id.Role}
                            onChange={(e) => handleModify(e, "Role")}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={id.Scope}
                            onChange={(e) => handleModify(e, "Scope")}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={id.Support}
                            onChange={(e) => handleModify(e, "Support")}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={id.Acc_Year}
                            onChange={(e) => handleModify(e, "Acc_Year")}
                          />
                        </td>
                      </tr>
                    </table>
                    <button
                      onClick={() => {
                        handleSubmitModify();
                        close();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </Popup>
            <input
              type="button"
              onClick={(e) => handleDelete(e, index)}
              value="Delete"
            />
          </div>
        );
      })}
      <div>
        <input type="text" onChange={(e) => handleAdd(e, "Role")} />
        <input type="text" onChange={(e) => handleAdd(e, "Scope")} />
        <input type="text" onChange={(e) => handleAdd(e, "Support")} />
        <input type="text" onChange={(e) => handleAdd(e, "Peroid")} />
        <input type="submit" onClick={handleSubmitAdd} />
      </div>
    </>
  );
}