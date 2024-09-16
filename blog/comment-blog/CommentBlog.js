import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';

// ================================|| CommentBlog ||================================ //

const CommentBlog = () => {
    const [params] = useSearchParams();
    const [BlogCommentdata, setBlogCommentData] = useState();

    useEffect(() => {
        getBlogCommentsById();
    }, []);

    const getBlogCommentsById = async () => {
        try {
            var GetBlogCommentsByIdAPI = API.getAdminBlogCommentsById;
            GetBlogCommentsByIdAPI = GetBlogCommentsByIdAPI + "?id=" + params.get("Id");
            const response = await fetch(GetBlogCommentsByIdAPI);
            const jsonData = await response.json();
            setBlogCommentData(jsonData.recordsets[0]);
            console.log(BlogCommentdata);
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Blog Comment - The Bridge Code</title>
            </Helmet>
            <div className='container-fluid p-0'>
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 pb-5">Blog Comment Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/comments-blog' className="btn btn-info cl-button -primary">Back to List</Link>
                    </div>
                </div>
                <div className="container align-item-center py-2 blog_dec ">
                    {BlogCommentdata &&
                        BlogCommentdata.map(({ Id, Blog_Id, FirstName, LastName, Email, Description, CreatedOn, CreatedBy }) => (
                            <div className="card-header bg-body rounded px-3 pb-5">
                                <div className="display-6 mb-3"><span className="fw-bold">{FirstName} {LastName}</span></div>
                                <div className="display-6 mb-3">{Email}</div>
                                <p><div className="text-decoration-none py-3 img-fluid" >{Description}</div></p>
                                <p className="text-end text-secondary">{moment(CreatedOn).format('DD-MMMM-YYYY')}</p>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default CommentBlog;