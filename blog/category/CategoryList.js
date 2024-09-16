import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaTimes, FaEdit, FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import moment from 'moment';
import API from '../../../../middleware/API';
import DataTable from 'react-data-table-component';

// ================================|| CategoryList ||================================ //

function CategoryList() {
    const navigate = useNavigate();
    const [Page, setPage] = useState(1);
    const [Categorydata, setCategoryData] = useState();
    const [TotalCategory, setTotalCategory] = useState();
    const [loading, setLoading] = useState(false);

    const rowsperPage = "5";

    useEffect(() => {
        getAdminCategoryList();
    }, [Page]);

    const getAdminCategoryList = async () => {
        try {
            setLoading(true);
            var GetAdminCategoryAPI = API.getCategories;
            GetAdminCategoryAPI = GetAdminCategoryAPI + '?pageNumber=' + Page + '&rowsperPage=' + rowsperPage;
            const response = await fetch(GetAdminCategoryAPI);
            const jsonData = await response.json();
            setCategoryData(jsonData.recordsets[0]);
            setTotalCategory(jsonData.recordsets[1][0].TotalRows);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    function deleteCategoryById(id) {
        var result = window.confirm('Are you sure you want to delete this record?');
        if (result) {
            try {
                var DeleteCategoryByIdAPI = API.deleteCategoryById;
                DeleteCategoryByIdAPI = DeleteCategoryByIdAPI + "?id=" + id;
                const response = fetch(DeleteCategoryByIdAPI).then(() => {
                    getAdminCategoryList(Page);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    function updateCategoryStatusById(id, IsActive) {
        var status;
        if (IsActive == true)
            status = 0;
        else
            status = 1;
        try {
            var UpdateCategoryStatusAPI = API.updateCategoryStatus;
            UpdateCategoryStatusAPI = UpdateCategoryStatusAPI + "?id=" + id + "&status=" + status;
            const response = fetch(UpdateCategoryStatusAPI).then(() => {
                getAdminCategoryList(Page);
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    function viewCategoryById(id) {
        navigate('/admin/category?Id=' + id);
    }

    function updateCategoryById(id) {
        navigate('/admin/edit-category?Id=' + id);
    }

    const columns = [
        {
            name: 'Id',
            selector: row => row.Id,
            sortable: true,
            width: "4rem"
        },
        {
            name: 'Category Name',
            selector: row => row.Name,
            sortable: true
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
            cell: (row) => <a className="cursor-pointer" onClick={() => updateCategoryStatusById(row.Id, row.IsActive)}>{row.IsActive ? (<FaCheck color="green" className="fa-2x"/>) : (<FaTimes color="red" className="fa-2x" />)}</a>,
            sortable: true,
            width: "5rem"
        },
        {
            name: 'Action',
            cell: (props) => <div>
                <a><FaEdit size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => updateCategoryById(props.Id)} style={{ cursor: "pointer" }} /></a>
                <a><FaEye size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => viewCategoryById(props.Id)} style={{ cursor: "pointer" }} /></a>
                <a><MdDelete size={30} className="m-1 p-1 cl-button -primary -small" onClick={() => deleteCategoryById(props.Id)} style={{ cursor: "pointer" }} /></a>
            </div>,
            sortable: false
        },
    ];

    return (
        <>
            <Helmet>
                <title>Blog Category - The Bridge Code</title>
            </Helmet>
            <div className="container-fluid">
                <div className="container d-flex pt-5">
                    <div className="col">
                        <h3 className="card-header px-3 ">Blog Category Details</h3>
                    </div>
                    <div className="col" style={{ textAlign: "end" }}>
                        <Link to='/admin/save-category' className="btn btn-info cl-button -primary mx-1 my-1">Add Category</Link>
                        <Link to='/admin/blogs' className="btn btn-info cl-button -primary ml-1">Back to List</Link>
                    </div>
                </div>

                <div className="container mx-auto pt-3">
                    <div className="px-3 pb-3">
                        <div className="col-sm-12 table-responsive text-nowrap shadow p-3 mb-5 bg-body rounded">
                            <DataTable
                                columns={columns}
                                data={Categorydata}
                                pagination
                                paginationServer
                                progressPending={loading}
                                paginationTotalRows={TotalCategory}
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

export default CategoryList;