import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaTimes, FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../middleware/API';
import DataTable from 'react-data-table-component';

// ================================|| BlogList ||================================ //

function BlogList() {
    const navigate = useNavigate();
    const [Page, setPage] = useState(1);
    const [Search, setSearch] = useState();
    const [BlogData, setBlogData] = useState();
    const [TotalBlog, setTotalBlog] = useState();
    const [loading, setLoading] = useState(false);

    const rowsperPage = "5";

    useEffect(() => {
        getAdminBlogList();
    }, [Page]);

    const getAdminBlogList = async () => {
        try {
            setLoading(true);
            var GetAdminBlogsAPI = API.getAdminBlogs;
            GetAdminBlogsAPI = GetAdminBlogsAPI + '?pageNumber=' + Page + '&rowsperPage=' + rowsperPage;
            const response = await fetch(GetAdminBlogsAPI);
            const jsonData = await response.json();
            setBlogData(jsonData.recordsets[0]);
            setTotalBlog(jsonData.recordsets[1][0].TotalRows);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    function deleteBlogById(id) {
        var result = window.confirm('Are you sure you want to delete this record?');
        if (result) {
            try {
                var DeleteBlogByIdAPI = API.deleteBlogById;
                DeleteBlogByIdAPI = DeleteBlogByIdAPI + "?id=" + id;
                const response = fetch(DeleteBlogByIdAPI).then(() => {
                    getAdminBlogList(Page);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    function updateBlogStatusById(id, IsActive) {
        var status;
        if (IsActive == true)
            status = 0;
        else
            status = 1;
        try {
            var UpdateBlogStatusByIdAPI = API.updateBlogStatusById;
            UpdateBlogStatusByIdAPI = UpdateBlogStatusByIdAPI + "?id=" + id + "&status=" + status;
            const response = fetch(UpdateBlogStatusByIdAPI).then(() => {
                getAdminBlogList(Page);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    function viewBlogById(id) {
        navigate('/admin/blog?Id=' + id);
    }

    function updateBlogById(id) {
        navigate('/admin/edit-blog?Id=' + id);
    }

    const columns = [
        {
            name: 'Id',
            selector: row => row.Id,
            sortable: true,
            width: "4rem"
        },
        {
            name: 'Title',
            cell: (props) =>
                <div className="text-truncate"><a href={`/blog-detail?Title=${props.BlogSlug}`} target="_blank" className="text-decoration-none text-dark">{props.BlogTitle}</a></div>,
            sortable: true,
            width: "12rem"
        },
        {
            name: 'Category',
            cell: (row) => row.Category ? <div className="text-truncate">{row.Category}</div> : (<span>N/A</span>),
            sortable: true,
            width: "8rem"
        },
        {
            name: 'Image',
            cell: (props) => <div className="p-2">
                <img src={props.BlogImage} width='100px' height='auto' />
            </div>,
            sortable: false,
            width: "8rem"
        },
        {
            name: 'Created By',
            selector: row => row.CreatedBy,
            sortable: true
        },
        {
            name: 'Created Date',
            selector: row => moment(row.CreatedOn).format('DD-MM-YYYY'),
            sortable: true
        },
        {
            name: 'Modified By',
            selector: row => row.ModifiedBy,
            sortable: true
        },
        {
            name: 'Modified Date',
            cell: (row) => row.ModifiedOn ? moment(row.ModifiedOn).format('DD-MM-YYYY') : (<span>N/A</span>),
            sortable: true
        },
        {
            name: 'Status',
            cell: (row) => <a className="cursor-pointer" onClick={() => updateBlogStatusById(row.Id, row.IsActive)}>{row.IsActive ? (<FaCheck color="green" className="fa-2x"/>) : (<FaTimes color="red" className="fa-2x" />)}</a>,
            sortable: true,
            width: "5rem"
        },
        {
            name: 'Action',
            cell: (props) => <div>
                <a><FaEdit size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => updateBlogById(props.Id)} style={{ cursor: "pointer" }} /></a>
                <a><FaEye size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => viewBlogById(props.Id)} style={{ cursor: "pointer" }} /></a>
                <a><MdDelete size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => deleteBlogById(props.Id)} style={{ cursor: "pointer" }} /></a>
            </div>,
            sortable: false
        },
    ];

    return (
        <>
            <Helmet>
                <title>Admin Blog - The Bridge Code</title>
            </Helmet>

            <div className="container-fluid">
                <div className="container d-flex pt-5 pb-3">
                    <div className="col-md-4">
                        <h3 className="card-header px-3">Blog Details</h3>
                    </div>
                    <div className="col-md-8" style={{ textAlign: "end" }}>
                        <Link to='/admin/schedule-blogs' className="btn btn-info cl-button -primary mx-1 my-1">Schedule Blogs</Link>
                        <Link to='/admin/trash-blogs' className="btn btn-info cl-button -primary mx-1 my-1">Trash Blogs</Link>
                        <Link to='/admin/comments-blog' className="btn btn-info cl-button -primary mx-1 my-1">Blog Comments</Link>
                        <Link to='/admin/categories' className="btn btn-info cl-button -primary mx-1 my-1">Blog Category</Link>
                        <Link to='/admin/save-blog' className="btn btn-info cl-button -primary mx-1 my-1">Add Blog</Link>
                    </div>
                </div>
                <div className="container mx-auto pt-3">
                    <div className="px-3 pb-3">
                        <div className="table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <div className="col-md-2 float-end">
                                <label htmlFor="search">
                                    <input id="search" type="text" placeholder="Searching..." onChange={(e) => setSearch(e.target.value)} />
                                </label>
                            </div>
                            <DataTable
                                columns={columns}
                                data={BlogData}
                                pagination
                                paginationServer
                                progressPending={loading}
                                paginationTotalRows={TotalBlog}
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

export default BlogList;