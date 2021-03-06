import { Request } from './requests.js'
import { UI } from './ui.js'

//* elementleri seçme

const form = document.getElementById('employee-form')
const nameInput = document.getElementById('name')
const departmentInput = document.getElementById('department')
const salaryInput = document.getElementById('salary')
const employeesList = document.getElementById('employees')
const updateEmployeeB = document.getElementById('update')
const search=document.getElementById('search')

const request = new Request('http://localhost:3000/employees')
const ui = new UI()
let updateArticle = null
eventListeners()
function eventListeners() {
  document.addEventListener('DOMContentLoaded', getAllEmployees)
  form.addEventListener('submit', addEmployee)
  employeesList.addEventListener('click', updateOrDelete)
  updateEmployeeB.addEventListener('click', putEmployee)
  search.addEventListener('input',searchUI)
}
function searchUI(e){
  const serachtext=e.target.value
  request.get().then(response=>{
    const filteredEmployee=response.filter(d=>d.name.indexOf(serachtext)!==-1)
    ui.searchUpdate(filteredEmployee)
  })
}

function getAllEmployees() {
  request
    .get()
    .then((employees) => {
      ui.addAllEmployeeToUI(employees)
    })
    .catch((err) => console.log(err))
}
function addEmployee(e) {
  const employeeName = nameInput.value.trim()
  const employeeDepartment = departmentInput.value.trim()
  const employeeSalary = salaryInput.value.trim()
  if (
    employeeName === '' ||
    employeeDepartment === '' ||
    employeeSalary === ''
  ) {
    alert('Lütfen tüm alanları doldurun')
  } else {
    request
      .post({
        name: employeeName,
        department: employeeDepartment,
        salary: Number(employeeSalary)
      })
      .then((response) => {
        ui.addEmployeeToUI(response)
      })
  }

  ui.clearInputs()
  e.preventDefault()
}

function updateOrDelete(e) {
  if (e.target.id === 'delete-employee') {
    if (confirm('eminmisiniz ??')) {
      deleteEmployee(e.target)
    }
  } else if (e.target.id === 'update-employee') {
    updateEmployee(e.target)
  }
}

function updateEmployee(e) {
  ui.toggleUpdateButton(e)
  if (updateArticle === null) {
    updateArticle = {
      updateId: e.parentElement.previousElementSibling.textContent,
      updateParent: e.parentElement.parentElement
    }
  } else {
    updateArticle = null
  }
}

function deleteEmployee(e) {
  const id =
    e.parentElement.previousElementSibling.previousElementSibling.textContent
  request
    .delete(id)
    .then((response) => {
      ui.deleteEmployeeFromUI(e.parentElement.parentElement)
      console.log(response)
      alert(response)
    })
    .catch((e) => console.log(e))
}

function putEmployee() {
  if (updateArticle) {
    const data = {
      name: nameInput.value.trim(),
      department: departmentInput.value.trim(),
      salary: Number(salaryInput.value.trim())
    }
    request
      .put(updateArticle.updateId, data)
      .then((response) => {
        ui.updateEmployeeOnUI(response, updateArticle.updateParent)
      })
      .catch((err) => console.log(err))
  }
}

// request
//   .get()
//   .then((employees) => console.log(employees))
//   .catch((e) => console.log(e))

// request.post({
//   name: 'vesile',
//   department: 'muhasebe',
//   salary: 6000
// }).then(employee=>console.log(employee))
// .catch(e=>console.log(e))

// request.put(3,{
//   name: 'miraç',
//   department: 'mimar',
//   salary: 1234
// }).then(employee=>console.log(employee))
// .catch(e=>console.log(e))

// request
//   .delete(3)
//   .then((response) => console.log(response))
//   .catch((e) => console.log(e))
