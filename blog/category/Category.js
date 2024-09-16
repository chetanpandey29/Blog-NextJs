import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';

// ================================|| Category ||================================ //

const Category = () => {
    const [params] = useSearchParams();
    const [Categorydata, setCategoryData] = useState();

    useEffect(() => {
        getCategoryById();
    }, []);

    const getCategoryById = async () => {
        try {
            var GetCategoryByIdAPI = API.getCategoryById ;
            GetCategoryByIdAPI = GetCategoryByIdAPI + "?id=" + params.get("Id");
            const response = await fetch(GetCategoryByIdAPI);
            const jsonData = await response.json();
            setCategoryData(jsonData.recordsets[0]);
            console.log(Categorydata);
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Category - The Bridge Code</title>
            </Helmet>
            <div className='container-fluid p-0'>
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 pb-5">Category Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/categories' className="btn btn-info cl-button -primary">Back to List</Link>
                    </div>
                </div>
                
                <div className="container-fluid mx-auto ">
                    <div className="px-3 pb-3">
                        <div className="table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <div className="container">
                                <div className="col-md-8 mx-auto">
                                    <div className="border rounded-3 p-2">
                                        <table className="row">
                                            <div className="col-md-3">
                                                <thead>
                                                    <tr>
                                                        <div className="col pb-2 fs-6 fw-bold">Index :- </div>
                                                        <div className="col pb-2 fs-6 fw-bold">Name :- </div>
                                                        <div className="col pb-2 fs-6 fw-bold">Created On :- </div>
                                                    </tr>
                                                </thead>
                                            </div>
                                            <div className="col-md-9">
                                                <tbody className="pb-4">
                                                    {Categorydata &&
                                                        Categorydata.map(({ Id, Name, CreatedOn }) => (
                                                            <tr key={Id}>
                                                                <div className='col table-data pb-2'>{Id}</div>
                                                                <div className='col table-data pb-2'>{Name}</div>
                                                                <div className='col table-data pb-2'>{moment(CreatedOn).format('DD-MM-YYYY')}</div>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </div>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;