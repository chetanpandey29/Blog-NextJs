import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';
import DataTable from 'react-data-table-component';

// ================================|| TrashBlogList ||================================ //

function TrashBlogList() {
    const navigate = useNavigate();
    const [Page, setPage] = useState(1);
    const [TrashBlogData, setTrashBlogData] = useState();
    const [TotalTrashBlog, setTotalTrashBlog] = useState();
    const [loading, setLoading] = useState(false);

    const rowsperPage = "5";

    useEffect(() => {
        getAdminTrashBlogList();
    }, [Page]);

    const getAdminTrashBlogList = async () => {
        try {
            setLoading(true);
            var GetTrashBlogsAPI = API.getTrashBlogs;
            GetTrashBlogsAPI = GetTrashBlogsAPI + '?pageNumber=' + Page + '&rowsperPage=' + rowsperPage;
            const response = await fetch(GetTrashBlogsAPI);
            const jsonData = await response.json();
            setTrashBlogData(jsonData.recordsets[0]);
            setTotalTrashBlog(jsonData.recordsets[1][0].TotalRows);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    function deleteBlogById(id) {
        var result = window.confirm('Are you sure you want to Permanent delete this record?');
        if (result) {
            try {
                var DeleteTrashBlogByIdAPI = API.deleteTrashBlogById;
                DeleteTrashBlogByIdAPI = DeleteTrashBlogByIdAPI + "?id=" + id;
                const response = fetch(DeleteTrashBlogByIdAPI).then(() => {
                    getAdminTrashBlogList(Page);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    function deleteTrashBlogs() {
        var result = window.confirm('Are you sure you want to Empty Trash?');
        if (result) {
            try {
                var DeleteTrashBlogsAPI = API.deleteTrashBlogs;
                const response = fetch(DeleteTrashBlogsAPI).then(() => {
                    getAdminTrashBlogList(Page);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    function revertBlogById(id) {
        try {
            var RevertBlogByIdAPI = API.revertBlogById;
            RevertBlogByIdAPI = RevertBlogByIdAPI + "?id=" + id;
            const response = fetch(RevertBlogByIdAPI).then(() => {
                getAdminTrashBlogList(Page);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    function updateBlogById(id) {
        navigate('/admin/edit-blog?Id=' + id);
    }

    function viewBlogById(id) {
        navigate('/admin/blog?Id=' + id);
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
            selector: row => row.BlogTitle,
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
            name: 'Deleted By',
            selector: row => row.ModifiedBy,
            sortable: true
        },
        {
            name: 'Deleted Date',
            cell: (row) => row.ModifiedOn ? moment(row.ModifiedOn).format('DD-MM-YYYY') : (<span>N/A</span>),
            sortable: true
        },
        {
            name: 'Status',
            cell: (props) =>
                <div className="col">
                    <a className="btn btn-info cl-button -primary" onClick={() => revertBlogById(props.Id)} dangerouslySetInnerHTML={{ __html: 'Revert' }}></a>
                </div>,
            sortable: false
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
                <title>Blog Trash - The Bridge Code</title>
            </Helmet>
            <div className="container-fluid">
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3">Trash Blog Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <a className="btn btn-info cl-button -primary mx-1 my-1" onClick={() => deleteTrashBlogs()} style={{ cursor: "pointer" }}>Empty Trash</a>
                        <Link to='/admin/blogs' className="btn btn-info cl-button -primary ml-1">Back to List</Link>
                    </div>
                </div>
                <div className="container mx-auto pt-3">
                    <div className="px-3 pb-3">
                        <div className="table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <DataTable
                                columns={columns}
                                data={TrashBlogData}
                                pagination
                                paginationServer
                                progressPending={loading}
                                paginationTotalRows={TotalTrashBlog}
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

export default TrashBlogList;