import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../middleware/API';

// ================================|| Blog ||================================ //

const Blog = () => {
    const [params] = useSearchParams();
    const [Blogdata, setBlogData] = useState();

    useEffect(() => {
        getBlogById();
    }, []);

    const getBlogById = async () => {
        try {
            var GetBlogByIdAPI = API.getBlogById;
            GetBlogByIdAPI = GetBlogByIdAPI + "?id=" + params.get("Id");
            const response = await fetch(GetBlogByIdAPI);
            const jsonData = await response.json();
            setBlogData(jsonData.recordsets[0]);
            console.log(Blogdata);
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Blog Description - The Bridge Code</title>
            </Helmet>
            <div className='container-fluid p-0'>
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 pb-3">Blog Detail</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/blogs' className="btn btn-info cl-button -primary">Back to List</Link>
                    </div>
                </div>
                <div className="container py-2 blog_dec ">
                    {Blogdata &&
                        Blogdata.map(({ Id, BlogTitle, Category, BlogTages, BlogImage, BlogDescription, CreatedOn, CreatedBy, Profile }) => (
                            <div className="col-md-12 row px-3">
                                <div className="text-center display-3 pt-3 py-4">{BlogTitle}</div>
                                <div className="blog-post-header-info">
                                    <div className="blog-post-header-authors align-item-center text-center p-0"><img src={Profile} className="w-px-40 h-auto rounded-circle"/>
                                        <p className="fs-6 m-0 fw-bold">By: {CreatedBy}</p>
                                        <div className="fs-6 py-3 fw-bold" style={{ textAlign: "end" }}>Date: {moment(CreatedOn).format('DD-MM-YYYY')}</div>
                                    </div>
                                </div>
                                <div className="fw-bold display-6 py-3">{BlogTitle}</div>
                                <div className="align-item-center text-center py-3"><img src={BlogImage} className="img-fluid" /></div>
                                <p><div className="text-decoration-none py-3 img-fluid" dangerouslySetInnerHTML={{ __html: BlogDescription }} ></div></p>
                                <p className="fs-6 m-0 fw-bold">Category: {Category}</p>
                                <p className="fs-6 m-0 fw-bold">Tags: {BlogTages}</p>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Blog;