import React, { useEffect } from "react";
import { message } from "antd";
import { GetUserInfo } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser, ReloadUser } from "../redux/usersSlice";
import DefaultLayout from "./DefaultLayout";
import axios from "axios";

const ProtectedRoute = (props) => {
  const { user, reloadUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      // const response = await GetUserInfo();
      const response = await axios.post(
        "/api/users/get-user-info",
        { token: localStorage.getItem("token") },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        message.error(response.data.message);
        localStorage.clear();
        navigate("/login");
      }
      dispatch(ReloadUser(false));
    } catch (error) {
      navigate("/login");
      localStorage.clear();
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!user) {
        getData();
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (reloadUser) {
      getData();
    }
  }, [reloadUser]);

  return (
    user && (
      <div>
        <DefaultLayout>{props.children}</DefaultLayout>
      </div>
    )
  );
};

export default ProtectedRoute;
