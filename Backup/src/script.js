import { getOrders, getOrderByID, setOrder, editOrder, deleteOrder, getClients, getModels, getComplectation, getCities } from "./fetch";
import modalViewOrder from "./templates/modal-view-order.hbs"
import modalCreateOrder from "./templates/modal-create-order.hbs"
import markupServiceRow2 from "./templates/service-item-row.hbs"
import NativejsSelect from 'nativejs-select';
// import 'nativejs-select/build/nativejs-select.css';

const order = {
    city: "",
    client: "",
    postEntry: {
        number: 0,
        cost: 0,
        date: "",
        comment: ""
    },
    serviceItems: [
        // {
        //     model: "",
        //     stickerSerialNumber: 0,
        //     insideSerialNumber: "",
        //     complectation: [],
        //     madeServise: [],
        //     price: 0,
        //     comment: ""
        // }
    ],
    postSend: {
        number: 0,
        date: "",
        comment: ""
    },

    payment: false,
    paymentDetails: [{
        date: "",
        amount: 0,
        typeOfPayment: ""
    }]

}


let counterRow = 0
let elementId = 0

const refs = {

    createOrderBtn: document.querySelector('[data-create-order]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    viewModelsBtn: document.querySelector('[data-view-models]'),
    modal: document.querySelector('[data-modal]'),
    createOrderForm: '',
    plusServiceIcon: "",
    serviceItemRow: "",
    formMiddleBox: "",
    ordersList: document.querySelector(".orders-list"),

    modalContent: document.querySelector('.modal-content')

};

markupOrdersList()

// markupPlusServiceIcon()


refs.createOrderBtn.addEventListener('click', createOrderFn);
refs.closeModalBtn.addEventListener('click', closeModal);
refs.viewModelsBtn.addEventListener('click', viewModels);


// refs.plusServiceIcon.addEventListener("click", plusServiceRow)
// refs.createOrderForm.addEventListener("submit", onSubmitOrder)

refs.ordersList.addEventListener("click", onClickOrderList)

function createOrderFn(ev) {
    openModalFn()

    refs.modalContent.insertAdjacentHTML('beforeend', modalCreateOrder(order))

    markupCityOptions()
    markupClientOptions()



    markupServiceRow(counterRow)

    // const currentModel = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-model-js`)
    // const currentService = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-service-js`)
    // const currentComplectation = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-complectation-js`)
    // const currentPrice = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-price-input`)

    // markupModelsOptions(currentModel)

    // let modelName = ''
    // let currentPriceService = 0

    // currentModel.addEventListener("change", (ev) => {
    //     currentService.innerHTML = ""
    //     modelName = ev.currentTarget.value
    //     markupModelsTypesServices(currentService, modelName)
    //     console.log(currentPriceService)
    // })

    // currentService.addEventListener("change", (ev) => {
    //     let typeService = ev.currentTarget.value
    //     getPriceServices(currentPrice, modelName, typeService)
    // })


    // markupComplectationOptions(currentComplectation)

    // new NativejsSelect({
    //     selector: '.form__service-item-service-js',
    //     enableSearch: true,
    //     placeholder: 'Виконані роботи',

    // });

    getRowRefToPastePlusServiceIcon()
    refs.serviceItemRow.insertAdjacentHTML("beforeend", markupPlusServiceIcon(hrefPlusIcon))
    refs.plusServiceIcon = document.querySelector(".form__plus-service")
    refs.plusServiceIcon.addEventListener("click", plusServiceRow)
    // getRowRefToPastePlusServiceIcon()
    // refs.serviceItemRow.appendChild(refs.plusServiceIcon)
    // refs.serviceItemRow.insertAdjacentHTML("beforeend", markupPlusServiceIcon())

}

function openModalFn() {
    refs.modal.classList.toggle('backdrop--is-hidden');
}

function closeModal() {
    refs.modal.classList.toggle('backdrop--is-hidden');
    counterRow = 0
    refs.modalContent.innerHTML = ''
    // refs.createOrderForm.removeEventListener("submit", onSubmitOrder)
    // markupOrdersList()

}

function plusServiceRow() {
    counterRow += 1

    markupServiceRow(counterRow)

    getRowRefToPastePlusServiceIcon()

    refs.serviceItemRow.appendChild(refs.plusServiceIcon)
}

function getRowRefToPastePlusServiceIcon() {

    for (let i = 0; i <= counterRow; i += 1) {
        refs.serviceItemRow = document.querySelector(`.form__service-item-row.num${i}`)
    }
}

function onSubmitOrder(ev) {
    ev.preventDefault()

    const {
        elements: { city, client, postEntryNumber, postEntryDate, postEntryCost, postEntryComent, model, stickerSerialNumber, madeServise, complectation, price, postSendNumber, postSendDate, postSendComment, payment, paymentDetailsAmount, paymentDetailsDate, paymentDetailsType
        }
    } = ev.currentTarget;

    const createdOrder = { ...order }

    for (let i = 0; i <= counterRow; i += 1) {

        createdOrder.serviceItems.push({
            model: "",
            stickerSerialNumber: 0,
            insideSerialNumber: "",
            complectation: [],
            madeServise: [],
            price: 0,
            comment: ""
        })
        createdOrder.serviceItems[i].model = ev.currentTarget.elements[`model${i}`].value
        createdOrder.serviceItems[i].stickerSerialNumber = ev.currentTarget.elements[`stickerSerialNumber${i}`].value
        createdOrder.serviceItems[i].madeServise = ev.currentTarget.elements[`madeServise${i}`].value
        createdOrder.serviceItems[i].complectation = ev.currentTarget.elements[`complectation${i}`].value
        createdOrder.serviceItems[i].price = ev.currentTarget.elements[`price${i}`].value
    }

    createdOrder.city = city.value
    createdOrder.client = client.value
    createdOrder.postEntry.number = postEntryNumber.value
    createdOrder.postEntry.date = postEntryDate.value
    createdOrder.postEntry.cost = postEntryCost.value
    createdOrder.postEntry.comment = postEntryComent.value

    setOrder(createdOrder).then(res => {
        refs.modal.classList.toggle('backdrop--is-hidden');
        console.log(res)

        markupOrdersList()


    }).catch(err => { })
    console.log(ev)

    refs.modalContent.innerHTML = ''
    // refs.createOrderForm.removeEventListener("submit", onSubmitOrder)


}

function markupOrdersList() {
    refs.ordersList.innerHTML = "";
    getOrders()
        .then(res => {
            let row = []

            for (let i = 0; i < res.length; i += 1) {
                row.push(
                    `<li class="orders-list-item" data-id="${res[i].id}">
                        <span class="column-list-item">${res[i].id}</span>
                        <span class="column-list-item">${res[i].city}</span>
                        <span class="column-list-item">${res[i].client}</span>
                        <span class="column-list-item">${res[i].postEntry.date}</span>
                        <span class="column-list-item">${res[i].serviceItems.length}</span>
                        <span class="column-list-item">${res[i].payment}</span>
                     </li>`
                )
            }

            refs.ordersList.insertAdjacentHTML("beforeend", row.join(""))
        })
        .catch(err => { console.log(err) })
}

function markupServiceRow(index) {
    refs.formMiddleBox = document.querySelector(".form__middle-box");
    refs.formMiddleBox.insertAdjacentHTML('beforeend', markupServiceRow2({ index }))

    // 1111111111


    const currentModel = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-model-js`)
    const currentService = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-service-js`)
    const currentComplectation = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-complectation-js`)
    const currentPrice = document.querySelector(`.form__service-item-row.num${counterRow} .form__service-item-price-input`)

    markupModelsOptions(currentModel, index)

    let modelName = ''
    let currentPriceService = 0

    currentModel.addEventListener("change", (ev) => {
        currentService.innerHTML = ""
        modelName = ev.currentTarget.value
        markupModelsTypesServices(currentService, modelName, index)
        console.log(currentPriceService)
    })

    currentService.addEventListener("change", (ev) => {
        let typeService = ev.currentTarget.value
        getPriceServices(currentPrice, modelName, typeService)
    })


    markupComplectationOptions(currentComplectation, index)

    new NativejsSelect({
        selector: `.form__service-item-service-js.num${index}`,
        enableSearch: true,
        placeholder: 'Виконані роботи',

    });

    document.querySelector(`.form__delete-service.num${index}`).addEventListener("click", () => {
        deteleRow(index)
    })

}

function markupPlusServiceIcon(hrefPlusIcon) {

    // refs.plusServiceIcon = document.createElement("img")
    // refs.plusServiceIcon.setAttribute("class", "form__plus-service")
    // refs.plusServiceIcon.setAttribute("src", "./images/plus.svg")
    // refs.plusServiceIcon.setAttribute("width", "18px")
    // refs.plusServiceIcon.setAttribute("height", "18px")
    // refs.plusServiceIcon.hasAttribute("width")

    return `
    <img class="form__plus-service" src="${hrefPlusIcon}" width="18px" height="18px" />

    `

}

function onClickOrderList(ev) {
    // if (ev.currentTarget === )

    elementId = ev.target.parentElement.dataset.id

    openModalFn()

    // console.dir(ev.target.parentElement)

    console.dir(elementId)

    getOrderByID(elementId)
        .then(order => {
            console.log(order)
            refs.modalContent.insertAdjacentHTML('beforeend', modalViewOrder(order))

            //33333

            //333333
            const createOrderForm = document.querySelector(".form.create-order");
            createOrderForm.addEventListener("submit", onEditOrder)

        })
        .catch()



}

function onEditOrder(ev) {
    ev.preventDefault()
    console.log(ev)

    ////2222
    const {
        elements: { city, client, postEntryNumber, postEntryDate, postEntryCost, postEntryComent, model, stickerSerialNumber, madeServise, complectation, price, postSendNumber, postSendDate, postSendComment, payment, paymentDetailsAmount, paymentDetailsDate, paymentDetailsType
        }
    } = ev.currentTarget;

    const createdOrder = { ...order }

    // for (let i = 0; i <= counterRow; i += 1) {

    //     createdOrder.serviceItems.push({
    //         model: "",
    //         stickerSerialNumber: 0,
    //         insideSerialNumber: "",
    //         complectation: [],
    //         madeServise: [],
    //         price: 0,
    //         comment: ""
    //     })
    //     createdOrder.serviceItems[i].model = ev.currentTarget.elements[`model${ i }`].value
    //     createdOrder.serviceItems[i].stickerSerialNumber = ev.currentTarget.elements[`stickerSerialNumber${ i }`].value
    //     createdOrder.serviceItems[i].madeServise = ev.currentTarget.elements[`madeServise${ i }`].value
    //     createdOrder.serviceItems[i].complectation = ev.currentTarget.elements[`complectation${ i }`].value
    //     createdOrder.serviceItems[i].price = ev.currentTarget.elements[`price${ i }`].value
    // }

    createdOrder.city = city.value
    createdOrder.client = client.value
    createdOrder.postEntry.number = postEntryNumber.value
    createdOrder.postEntry.date = postEntryDate.value
    createdOrder.postEntry.cost = postEntryCost.value
    createdOrder.postEntry.comment = postEntryComent.value
    //2222
    editOrder(createdOrder, elementId).then().catch

}

function markupModelsOptions(currentModel, index) {
    getModels()
        .then(res => {

            const markupOptions = res.map(model => {
                return `<option value="${model.name}">${model.name}</option>`
            }).join("")

            currentModel.insertAdjacentHTML('beforeend', `${markupOptions}`)

            new NativejsSelect({
                selector: `.form__service-item-model-js.num${index}`,
                enableSearch: true,
                placeholder: 'Модель',

            });

        })
        .catch()
}

function markupModelsTypesServices(currentService, modelName, index) {
    getModels()
        .then(res => {
            const markupOptions = res.map(model => {
                if (model.name === modelName) {
                    return model.services.map(service => {
                        return `<option value="${service.type}">${service.type}</option> `
                    })
                }
            }).join("")

            currentService.insertAdjacentHTML('beforeend', markupOptions)

            new NativejsSelect({
                selector: `.form__service-item-service-js.num${index}`,
                enableSearch: true,
                placeholder: 'Виконані роботи',
            });

        })
        .catch()
}

function markupComplectationOptions(currentComplectation, index) {
    getComplectation()
        .then(res => {

            const markupOptions = res.map(complectation => {
                return `<option value="${complectation}">${complectation}</option>`
            }).join("")

            currentComplectation.insertAdjacentHTML('beforeend', `${markupOptions}`)

            new NativejsSelect({
                selector: `.form__service-item-complectation-js.num${index}`,
                enableSearch: true,
                placeholder: 'Комплектація',
            });
        })
        .catch()
}

function getPriceServices(currentPrice, modelName, typeService) {
    getModels()
        .then(res => {
            res.map(model => {
                if (model.name === modelName) {
                    return model.services.map(service => {
                        if (service.type === typeService) {
                            currentPrice.value = service.price
                        }
                    })
                }
            })
        })
        .catch()
}

function deteleRow(index) {
    if (index === counterRow) {
        return
    }
    document.querySelector(`.form__service-item-row.num${index}`).innerHTML = ''
}

function viewModels() {
    console.log("models")
    openModalFn()


}

function markupCityOptions() {
    getCities()
        .then(res => {

            const markupOptions = res.map(city => {
                return `<option value="${city}">${city}</option>`
            }).join("")

            document.querySelector(".form__city-js").insertAdjacentHTML('beforeend', `${markupOptions}`)

            new NativejsSelect({
                selector: '.form__city-js',
                enableSearch: true,
                placeholder: ' ',
            });

        })
        .catch()
}

function markupClientOptions() {
    getClients()
        .then(res => {

            const markupOptions = res.map(client => {
                return `<option value="${client}">${client}</option>`
            }).join("")

            document.querySelector(".form__client-js").insertAdjacentHTML('beforeend', `${markupOptions}`)

            new NativejsSelect({
                selector: '.form__client-js',
                enableSearch: true,
                placeholder: " "
            });

        })
        .catch()
}

const hrefPlusIcon = document.querySelector(".sample-plus-icon").src
const hrefDeleteIcon = document.querySelector(".sample-delete-icon").src


