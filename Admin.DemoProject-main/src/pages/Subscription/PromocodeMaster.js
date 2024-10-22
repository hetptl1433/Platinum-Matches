import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  createPromocodeMaster,
  getPromocodeMaster,
  removePromocodeMaster,
  updatePromocodeMaster,
} from "../../functions/Products/PromocodeMaster";
import moment from "moment-timezone";
const initialState = {
  code: "",
  savePercentage: "",
  startDate: moment().format("MM-DD-YYYY"),
  endDate: moment().format("MM-DD-YYYY"),
  IsActive: false,
};

const PromocodeMaster = () => {
  const [values, setValues] = useState(initialState);
  const { code, savePercentage, startDate, endDate, IsActive } = values;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getPromocodeMaster(_id)
      .then((res) => {
        console.log(res);
        setValues({
          ...values,
          code: res.code,
          savePercentage: res.savePercentage,
          startDate: moment(res.startDate).format("YYYY-MM-DD"),
          endDate: moment(res.endDate).format("YYYY-MM-DD"),
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(errors).length === 0) {
    createPromocodeMaster(values)
      .then((res) => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setIsSubmit(false);
        setFormErrors({});
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removePromocodeMaster(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // let erros = validate(values);
    // setFormErrors(erros);
    setIsSubmit(true);

    // if (Object.keys(erros).length === 0) {
    updatePromocodeMaster(_id, values)
      .then((res) => {
        setmodal_edit(!modal_edit);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    // fetchUsers(1); // fetch page 1 of users
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list-by-params/PromocodeMaster`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          IsActive: filter,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setData(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setData([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Promocode",
      selector: (row) => row.code,
      sortable: true,
      sortField: "code",
      minWidth: "150px",
    },
    {
      name: "Save(%)",
      selector: (row) => row.savePercentage,
      sortable: true,
      sortField: "savePercentage",
      minWidth: "150px",
    },
    {
      name: "Start Date",
      selector: (row) => {
        const dateObject = new Date(row.startDate);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "startDate",
      minWidth: "150px",
    },
    {
      name: "End Date",
      selector: (row) => {
        const dateObject = new Date(row.endDate);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format("MM-DD-YYYY")}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "endDate",
      minWidth: "150px",
    },
    {
      name: "Created Date & Time",
      selector: (row) => {
        const dateObject = new Date(row.createdAt);

        return (
          <React.Fragment>
            {moment(new Date(dateObject.getTime())).format(
              "MM-DD-YYYY hh:mm A"
            )}
          </React.Fragment>
        );
      },
      sortable: true,
      sortField: "createdAt",
      minWidth: "150px",
    },

    {
      name: "Status",
      selector: (row) => {
        return <p>{row.IsActive ? "Active" : "InActive"}</p>;
      },
      sortable: false,
      sortField: "Status",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div>

              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = "Promocode Master | Platinum Matches";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Subscriptions"
            title="Promocode Master"
            pageTitle="Subscriptions"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Promocode Master
                      </h2>
                    </Col>

                    <Col sm={6} lg={4} md={6}>
                      <div className="text-end mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="filter"
                          value={filter}
                          defaultChecked={true}
                          onChange={handleFilter}
                        />
                        <Label className="form-check-label ms-2">Active</Label>
                      </div>
                    </Col>
                    <Col className="col-sm-auto" sm={12} lg={4} md={12}>
                      <div className="d-flex justify-content-sm-end">
                        <div className="ms-2">
                          <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button>
                        </div>
                        <div className="search-box ms-2">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search..."
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={data}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add Promocode
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="Enter code "
                required
                name="code"
                value={code}
                onChange={handleChange}
              />
              <Label>
                Promocode<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="savePercentage "
                required
                name="savePercentage"
                value={savePercentage}
                onChange={handleChange}
              />
              <Label>
                Save(%)<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="startDate "
                required
                name="startDate"
                value={startDate}
                onChange={handleChange}
                min={moment().format("YYYY-MM-DD")}
              />
              <Label>
                Start Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="endDate "
                required
                name="endDate"
                value={endDate}
                onChange={handleChange}
                min={startDate}
              />
              <Label>
                End Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleClick}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_list(false);
                  setValues(initialState);
                  setIsSubmit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit Promocode
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="Enter code "
                required
                name="code"
                value={code}
                onChange={handleChange}
              />
              <Label>
                Promocode <span className="text-danger">*</span>
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className="form-control"
                placeholder="savePercentage "
                required
                name="savePercentage"
                value={savePercentage}
                onChange={handleChange}
              />
              <Label>
                Save(%) <span className="text-danger">*</span>
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="startDate "
                required
                name="startDate"
                value={startDate}
                onChange={handleChange}
                min={moment().format("YYYY-MM-DD")}
              />
              <Label>
                Start Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="date"
                className="form-control"
                placeholder="endDate "
                required
                name="endDate"
                value={endDate}
                onChange={handleChange}
                min={startDate}
              />
              <Label>
                End Date<span className="text-danger">*</span>{" "}
              </Label>
              {/* {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )} */}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Remove Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(false);
          }}
        >
          Remove Promocode
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="mt-2 text-center">
              <lord-icon
                src="https://cdn.lordicon.com/gsqxdxog.json"
                trigger="loop"
                colors="primary:#f7b84b,secondary:#f06548"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you sure ?</h4>
                <p className="text-muted mx-4 mb-0">
                  Are you Sure You want to Remove this Record ?
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-danger"
                id="add-btn"
                onClick={handleDelete}
              >
                Remove
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setmodal_delete(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default PromocodeMaster;
