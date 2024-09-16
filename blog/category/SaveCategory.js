import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import { Cookies, useCookies } from "react-cookie";
import API from '../../../../middleware/API';

// ================================|| SaveCategory ||================================ //

function SaveCategory() {
    const navigate = useNavigate();
    const [CategoryName, SetCategoryName] = useState("");              // store the input values
    const [IsActive, SetIsActive] = useState("");                      // store the input values 
    const [cookie, SetCookie] = useCookies(['username']);
    const cookies = new Cookies();
    const user = cookies.get('id');


    let submitHandler = async (e) => {
        e.preventDefault();

        var checked = false;
        if (document.querySelector('#IsActive:checked')) {
            checked = true;
        }

        if (document.querySelector('#IsSchedule:checked')) {
            document.getElementById('#ScheduleTime').removeAttr('hidden');
        }

        try {
            var SaveCategoryAPI = API.saveCategory;
            let res = await fetch(SaveCategoryAPI, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                json: true,
                body: JSON.stringify({
                    name: CategoryName,
                    createdBy: user,
                    isActive: checked
                }),
            });
            let resJson = await res.json();
            if (resJson.status === 200) {
                SetCategoryName("");
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
                <title>Save Category - The Bridge Code</title>
            </Helmet>
            <div className="container p-0">
                <div className="container row pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 pb-3">Enter Category Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/categories' className="btn btn-info cl-button -primary">Back To List</Link>
                    </div>
                </div>
                <div className="container mx-auto ">
                    <div className="px-3 pb-3">
                        <form className="pt-3" id='myform' onSubmit={submitHandler}>
                            <div className="form-item pb-4">
                                <input type="text" name="CategoryName" id="CategoryName" onChange={(e) => SetCategoryName(e.target.value)} required />
                                <label className='labe' >Category Name</label>
                            </div>
                            <div className="form-check pb-4">
                                <input className="form-check-input" type="checkbox" name="IsActive" id="IsActive" value={IsActive} onChange={(e) => SetIsActive(e.target.value)} />
                                <label className="form-check-label ms-1" for="flexCheckDefault">
                                    Is-Active
                                </label>
                            </div>
                            <div className="col px-5" style={{ textAlign: "center" }}>
                                <input type="submit" value="Submit" className="btn btn-info cl-button -primary" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SaveCategory;