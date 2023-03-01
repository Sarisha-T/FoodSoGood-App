// import packages
import AOS from "aos";
import { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";

// import icons
import { MdDelete, MdEdit } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";

// import components
import { RestaurantNavbar } from "../components/Navbar";

// import URL
import { url } from "../App";

//initialize animation on scroll
AOS.init();

//component to display foods of the restaurant
function RestaurantFoods() {
  // state variables
  const [foods, setFoods] = useState([]);
  const [updateFood, setUpdateFood] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [show, setShow] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  //modal functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const UpdateModalClose = () => setUpdateModal(false);
  const UpdateModalOpen = () => setUpdateModal(true);

  //get user details
  let token = useRef(JSON.parse(localStorage.getItem("userDetails")).token);
  let restaurant = useRef(JSON.parse(localStorage.getItem("userDetails")).user);

  const formData = new FormData();
  const updatedFoodImage = new FormData();

  // function to take the value entered
  const inputValue = (property, value) => formData.append(property, value);

  useEffect(() => {
    // fetch all foods
    fetch(`${url}/restaurant/foods/${restaurant.current._id}`, {
      headers: { authorization: `bearer ${token.current}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  //function to add a new food
  const addFood = () => {
    formData.append("restaurant", restaurant.current._id);

    fetch(`${url}/food/addFood`, {
      method: "POST",
      body: formData,
      headers: { authorization: `bearer ${token.current}` },
    })
      .then((res) => res.json())
      .then((data) => {
        let food = data.food;
        let foodCopy = [...foods];
        foodCopy.push(food);
        setFoods(foodCopy);
        handleClose();
      })
      .catch((err) => console.log(err));
  };

  // to delete food
  const deleteFood = (id, index) => {
    fetch(`${url}/food/deleteFood/${id}`, {
      method: "DELETE",
      headers: { authorization: `bearer ${token.current}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        let foodCopy = [...foods];

        foodCopy.splice(index, 1);

        setFoods(foodCopy);
      })
      .catch((err) => console.log(err));
  };

  // function to take value entered from input
  const newUpdateData = (property, value) => {
    let updateFoodCopy = { ...updateFood };
    updateFoodCopy[property] = value;
    setUpdateFood(updateFoodCopy);
  };

  //to update food
  const updateFoodDetails = () => {
    fetch(`${url}/food/updateFood/${updateFood._id}`, {
      method: "PUT",
      headers: {
        authorization: `bearer ${token.current}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(updateFood),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (updatedFoodImage.get("image") !== null) {
            fetch(`${url}/food/updateFoodImage/${updateFood._id}`, {
              method: "PUT",
              headers: {
                authorization: `bearer ${token.current}`,
              },
              body: updatedFoodImage,
            })
              .then((res) => res.json())
              .then((response) => {
                if (response.success) {
                  let foodCopy = [...foods];
                  let index = foodCopy.findIndex(
                    (food) => food._id === updateFood._id
                  );
                  foodCopy[index] = updateFood;
                  foodCopy[index].image = response.fileName;
                  setFoods(foodCopy);
                  UpdateModalClose();
                }
              })
              .catch((err) => console.log(err));
          } else {
            let foodCopy = [...foods];
            let index = foodCopy.findIndex(
              (food) => food._id === updateFood._id
            );
            foodCopy[index] = updateFood;
            setFoods(foodCopy);
            UpdateModalClose();
          }
        }
      })
      .catch((err) => console.log(err));
  };

  //to fetch food to update
  const selectedFood = (index) => {
    let food = foods[index];
    setUpdateFood(food);
    UpdateModalOpen();
  };

  return (
    <div>
      <RestaurantNavbar />

      <div className="container">
        {/* ADD FOOD */}
        <Modal show={show} onHide={handleClose} data-aos="zoom-in">
          <Modal.Header closeButton>
            <Modal.Title>Add Food</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                addFood();
              }}
            >
              <input
                onChange={(e) => inputValue("name", e.target.value)}
                className="form-control"
                type="text"
                placeholder="Enter Food name"
                required
              />
              <div className="d-flex my-2">
                <div className="w-100 ">
                  <input
                    onChange={(e) => inputValue("quantity", e.target.value)}
                    className="form-control"
                    type="number"
                    placeholder="Enter Quantity"
                    required
                  />
                </div>
                <div className="w-100">
                  <input
                    onChange={(e) => inputValue("price", e.target.value)}
                    style={{ width: "100%" }}
                    className="form-control"
                    type="number"
                    placeholder="Enter Price"
                    required
                  />
                </div>
              </div>

              <textarea
                minLength="10"
                onChange={(e) => inputValue("description", e.target.value)}
                className="form-control"
                type="text"
                placeholder="Enter Description"
                required
              />
              <input
                name="image"
                onChange={(e) => inputValue("image", e.target.files[0])}
                className="form-control"
                type="file"
                placeholder="choose Image"
                required
              />
              <button type="submit" className="add w-25 text-center mt-2 pt-2">
                Add Food Item
              </button>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal for updating the food details*/}
        <Modal show={updateModal} onHide={UpdateModalClose} data-aos="zoom-in">
          <Modal.Header closeButton>
            <Modal.Title>Update Food</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div style={{}} className="form">
              <h1 className="" style={{ textAlign: "center" }}>
                Update Food Details
              </h1>
              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();
                  updateFoodDetails();
                }}
              >
                <input
                  value={updateFood["name"]}
                  onChange={(e) => newUpdateData("name", e.target.value)}
                  className="form-control"
                  type="text"
                  placeholder="Enter Food name"
                  required
                />

                <div className="d-flex my-2">
                  <div className="w-100">
                    <label>Quantity</label>
                    <input
                      value={updateFood["quantity"]}
                      onChange={(e) =>
                        newUpdateData("quantity", e.target.value)
                      }
                      style={{ width: "100%" }}
                      className="form-control"
                      type="number"
                      placeholder="Enter Quantity"
                      required
                    />
                  </div>
                  <div className="w-100">
                    <label>Price</label>
                    <input
                      value={updateFood.price}
                      onChange={(e) => newUpdateData("price", e.target.value)}
                      className="form-control"
                      type="number"
                      placeholder="Enter Price"
                      required
                    />
                  </div>
                </div>

                <textarea
                  value={updateFood.description}
                  onChange={(e) => newUpdateData("description", e.target.value)}
                  className="form-control"
                  type="text"
                  placeholder="Enter Description"
                  required
                />
                <input
                  type="file"
                  className="form-control"
                  placeholder="choose image"
                  onChange={(e) =>
                    updatedFoodImage.append("image", e.target.files[0])
                  }
                />
                <button
                  type="submit"
                  className="add w-25 text-center mt-2 pt-2"
                >
                  Update Food
                </button>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        <div className="container">
          <h1 className="text-center my-4 icons">Our Food Menu</h1>
          <div className=" d-flex justify-content-center my-4">
            <button
              onClick={handleShow}
              className="add icons text-light shadow-lg p-2 ml-auto"
              style={{ cursor: "pointer", border: "1px solid orange" }}
            >
              Add Item
            </button>
          </div>

          {/* FOODs */}
          <main className="row mx-2">
            {foods.length === 0 ? (
              <h1>No Items Found :( </h1>
            ) : (
              foods.map((food, key) => (
                <div
                  key={key}
                  className="col-md-4 py-0 text-center"
                  data-aos="zoom-in"
                >
                  <div className="shadow-lg p-3 mb-5 bg-body rounded w-80">
                    <div className="d-flex justify-content-around my-2 mx-0 px-0">
                      <button
                        onClick={() => selectedFood(key)}
                        className="icon text-success"
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        +<MdEdit />
                      </button>
                      <button
                        onClick={() => deleteFood(food._id, key)}
                        className="icon text-danger"
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        x<MdDelete />
                      </button>
                    </div>

                    <img
                      src={`${url}/food/image/${food.image}`}
                      className="img-fluid overflow-hidden"
                      style={{
                        height: "150px",
                        width: "150px",
                      }}
                      alt="Food"
                    />

                    <div className="p-1">
                      <h1 className="">{food.name.toUpperCase()}</h1>
                      {/* <h1>{(food.name).toUpperCase()}</h1> */}
                      <p
                        className="m-0 mx-2"
                        style={{ fontFamily: "monospace" }}
                      >
                        {food.description}
                      </p>
                      <div className="flex-container">
                        <div className="w-50 my-1">
                          <h1 className="w-100">
                            &#8377; {food.price}
                            <GiMoneyStack
                              style={{
                                fontSize: "1.5rem",
                                color: "var(--btn)",
                              }}
                              className="icons"
                            />
                          </h1>
                        </div>
                        <div className="w-100 my-1">
                          {/* <p className='m-0'>Quantity</p> */}
                          <h1>
                            <span
                              style={{
                                fontSize: "1.1rem",
                                color: "var(--btn)",
                                fontFamily: "monospace",
                              }}
                            >
                              Instock:
                            </span>
                            {food.quantity}{" "}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default RestaurantFoods;
