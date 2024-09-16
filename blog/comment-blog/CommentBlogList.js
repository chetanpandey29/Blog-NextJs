import { useState, useEffect } from "react";
import { FaEye, FaCheckCircle, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';
import DataTable from 'react-data-table-component';

// ================================|| CommentBlogList ||================================ //

function CommentBlogList() {
    const navigate = useNavigate();
    const [Page, setPage] = useState(1);
    const [BlogCommentsdata, setBlogCommentsData] = useState();
    const [TotalBlogComments, setTotalBlogComments] = useState();
    const [loading, setLoading] = useState(false);

    const rowsperPage = "5";

    useEffect(() => {
        getAdminBlogCommentsList();
    }, [Page]);

    const getAdminBlogCommentsList = async () => {
        try {
            setLoading(true);
            var GetAdminBlogCommentsAPI = API.getAdminBlogComments;
            GetAdminBlogCommentsAPI = GetAdminBlogCommentsAPI + '?pageNumber=' + Page + '&rowsperPage=' + rowsperPage;
            const response = await fetch(GetAdminBlogCommentsAPI);
            const jsonData = await response.json();
            setBlogCommentsData(jsonData.recordsets[0]);
            setTotalBlogComments(jsonData.recordsets[1][0].TotalRows);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    function deleteCommentById(id) {
        var result = window.confirm('Are you sure you want to delete this record?');
        if (result) {
            try {
                var DeleteBlogCommentByIdAPI = API.deleteBlogCommentById;
                DeleteBlogCommentByIdAPI = DeleteBlogCommentByIdAPI + "?id=" + id;
                const response = fetch(DeleteBlogCommentByIdAPI).then(() => {
                    getAdminBlogCommentsList(Page);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    function updateCommentById(id, IsActive) {
        var status;
        if (IsActive == true)
            status = 1;
        else
            status = 0;
        try {
            var UpdateBlogCommentStatusAPI = API.updateBlogCommentStatus;
            UpdateBlogCommentStatusAPI = UpdateBlogCommentStatusAPI + "?id=" + id + "&status=" + status;
            const response = fetch(UpdateBlogCommentStatusAPI).then(() => {
                getAdminBlogCommentsList(Page);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    function viewCommentById(id) {
        navigate('/admin/comment-blog?Id=' + id);
    }

    const columns = [
        {
            name: 'Id',
            selector: row => row.Id,
            sortable: true,
            width: "4rem"
        },
        {
            name: 'Blog Title',
            selector: row => row.BlogTitle,
            sortable: true,
            width: "25rem"
        },
        {
            name: 'Name',
            selector: row => row.FirstName + ' ' + row.LastName,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.Email,
            sortable: true
        },
        {
            name: 'Created Date',
            selector: row => moment(row.CreatedOn).format('DD-MM-YYYY'),
            sortable: true
        },
        {
            name: 'Action',
            cell: (props) => <div className="row col-md-12">
                <div className="col-md-3 float-start p-0 m-0">
                    {(() => {
                        if (props.IsActive == false) {
                            return (
                                <a><FaCheckCircle size={30} className="m-1 p-1 btn btn-success" onClick={() => updateCommentById(props.Id, true)} style={{ cursor: "pointer" }} /></a>
                            )
                        }
                    })()}
                </div>
                <div className="col-md-3 float-start p-0 m-0"><a><FaTimes size={30} className="m-1 p-1 btn btn-danger" onClick={() => deleteCommentById(props.Id)} style={{ cursor: "pointer" }} /></a></div>
                <div className="col-md-3 float-start p-0 m-0"><a><FaEye size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => viewCommentById(props.Id)} style={{ cursor: "pointer" }} /></a></div>
            </div>,
            sortable: false
        },
    ];

    return (
        <>
            <Helmet>
                <title>Blog Comment - The Bridge Code</title>
            </Helmet>
            <div className="container-fluid">
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 ">Blog Comment Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/blogs' className="btn btn-info cl-button -primary ml-1">Back to List</Link>
                    </div>
                </div>

                <div className="container mx-auto pt-3">
                    <div className="px-3 pb-3">
                        <div className="col-sm-12 table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <DataTable
                                columns={columns}
                                data={BlogCommentsdata}
                                pagination
                                paginationServer
                                progressPending={loading}
                                paginationTotalRows={TotalBlogComments}
                                paginationPerPage={rowsperPage}
                                paginationComponentOptions={{
                                    noRowsPerPage: true
                                }}
                                onChangePage={page => setPage(page)}
                            ></DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommentBlogList;