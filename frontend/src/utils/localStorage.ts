import type { Company, User } from "../types";

export const saveCompany = (company: Company) => {
  const companies = JSON.parse(localStorage.getItem("companies") || "[]");
  companies.push(company);
  localStorage.setItem("companies", JSON.stringify(companies));
};

export const saveUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

export const getCompanies = (): Company[] => {
  return JSON.parse(localStorage.getItem("companies") || "[]");
};
