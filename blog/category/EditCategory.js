import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Cookies, useCookies } from "react-cookie";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Resizer from "react-image-file-resizer";
import API from '../../../../middleware/API';
import moment from 'moment';

// ================================|| EditCategory ||================================ //

function EditCategory() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [Categorydata, setCategoryData] = useState();
  const [CategoryName, SetCategoryName] = useState("");              // store the input values
  const [IsActive, SetIsActive] = useState("");                      // store the input values 
  const [cookie, SetCookie] = useCookies(['username']);
  const cookies = new Cookies();
  const user = cookies.get('id');

  useEffect(() => {
    getCategoryById();
  }, []);

  let Categoriesdata = "";

  const getCategoryById = async () => {
    try {
      var GetCategoryByIdAPI = API.getCategoryById;
      GetCategoryByIdAPI = GetCategoryByIdAPI + "?id=" + params.get("Id");
      const response = await fetch(GetCategoryByIdAPI);
      const jsonData = await response.json();
      setCategoryData(jsonData.recordset);
      console.log(Categorydata);
      Categoriesdata = jsonData.recordset[0];
      SetCategoryName(Categoriesdata.Name);
      SetIsActive(Categoriesdata.IsActive);
    }
    catch (error) {
      console.log(error);
    }
  };

 
  let submitHandler = async (e) => {
    e.preventDefault();
    
    var checked = false;
    if (document.querySelector('#IsActive:checked')) {
      checked = true;
    }

    try {
      var UpdateCategoryAPI = API.updateCategory;
      UpdateCategoryAPI = UpdateCategoryAPI + "?id=" + params.get("Id");
      let res = await fetch(UpdateCategoryAPI, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        json: true,
        body: JSON.stringify({
          name: CategoryName,
          modifiedBy: user,
          isActive: checked
        }),
      });
      let resJson = await res.json();
      if (resJson.status === 200) {
        SetCategoryName("");
        SetIsActive("");
        SetCookie("");
      }
      else
        navigate('/admin/categories');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Category - The Bridge Code</title>
      </Helmet>
      <div className="container p-0">
        <div className="container row pt-5">
          <div className="col">
            <h3 className="card-header px-3 pb-3">Edit Category Details</h3>
          </div>
          <div className="col" style={{ textAlign: "end" }}>
            <Link to='/admin/categories' className="btn btn-info cl-button -primary">Back To List</Link>
          </div>
        </div>
        <div className='container'>
          <form className="pt-4" id='myform' onSubmit={submitHandler}>
            <div className="form-item pb-4">
              <input type="text" name="CategoryName" id="CategoryName" value={CategoryName} onChange={(e) => SetCategoryName(e.target.value)} required />
              <label className='labe' >Category Name</label>
            </div>

            <div className="form-check pb-4">
              <input className="form-check-input" type="checkbox" name="IsActive" id="IsActive" onChange={() => SetIsActive(!IsActive)} checked={IsActive} />
              <label className="form-check-label ms-1" for="flexCheckDefault">
                Is-Active
              </label>
            </div>
            <input type="submit" value="Submit" className="cl-button -primary -small rounded-2 mt-2" />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
