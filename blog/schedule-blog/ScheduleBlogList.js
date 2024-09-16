import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaTimes, FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';
import DataTable from 'react-data-table-component';

// ================================|| ScheduleBlogList ||================================ //

function ScheduleBlogList() {
    const navigate = useNavigate();
    const [Page, setPage] = useState(1);
    const [ScheduleBlogData, setScheduleBlogData] = useState();
    const [TotalScheduleBlog, setTotalScheduleBlog] = useState();
    const [loading, setLoading] = useState(false);

    const rowsperPage = "5";

    useEffect(() => {
        getAdminScheduleBlogList();
    }, [Page]);

    const getAdminScheduleBlogList = async () => {
        try {
            setLoading(true);
            var GetScheduleBlogsAPI = API.getScheduleBlogs;
            GetScheduleBlogsAPI = GetScheduleBlogsAPI + '?pageNumber=' + Page + '&rowsperPage=' + rowsperPage;
            const response = await fetch(GetScheduleBlogsAPI);
            const jsonData = await response.json();
            setScheduleBlogData(jsonData.recordsets[0]);
            setTotalScheduleBlog(jsonData.recordsets[1][0].TotalRows);
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
                    getAdminScheduleBlogList(Page);
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
                getAdminScheduleBlogList(Page);
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
            name: 'Schedule By',
            selector: row => row.CreatedBy,
            sortable: true,
            width: "8rem"
        },
        {
            name: 'Schedule Date',
            selector: row => moment.utc(row.CreatedOn).format('DD-MM-YYYY h:mm A'),
            sortable: true,
            width: "10rem"
        },
        {
            name: 'Modified By',
            selector: row => row.ModifiedBy,
            sortable: true,
            width: "8rem"
        },
        {
            name: 'Modified Date',
            cell: (row) => row.ModifiedOn ? moment(row.ModifiedOn).format('DD-MM-YYYY') : (<span>N/A</span>),
            sortable: true,
            width: "10rem"
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
                <title>Schedule Blog - The Bridge Code</title>
            </Helmet>
            <div className="container-fluid">
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 pb-3">Schedule Blog Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/blogs' className="btn btn-info cl-button -primary ml-1">Back to List</Link>
                    </div>
                </div>
                <div className="container mx-auto pt-3">
                    <div className="px-3 pb-3">
                        <div className="table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <DataTable
                                columns={columns}
                                data={ScheduleBlogData}
                                pagination
                                paginationServer
                                progressPending={loading}
                                paginationTotalRows={TotalScheduleBlog}
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

export default ScheduleBlogList;