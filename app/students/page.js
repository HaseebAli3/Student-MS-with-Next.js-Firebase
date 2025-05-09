"use client";
import { useState, useEffect } from "react";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    age: "", 
    rollNo: "", 
    subjects: [] 
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    age: "", 
    rollNo: "", 
    subjects: [] 
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubject, setNewSubject] = useState("");

  const subjectOptions = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "Economics"
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (!form.name.trim() || !form.age.trim() || !form.rollNo.trim()) {
      setError("Please fill all required fields!");
      return;
    }
    if (isNaN(form.age) || form.age <= 0) {
      setError("Please enter a valid age (positive number)");
      return;
    }
    if (isNaN(form.rollNo) || form.rollNo <= 0) {
      setError("Please enter a valid roll number");
      return;
    }
    if (form.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add student");
      const newStudent = await res.json();
      const updatedList = [...students, newStudent];
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      setForm({ 
        name: "", 
        age: "", 
        rollNo: "", 
        subjects: [] 
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      const updatedList = students.filter((s) => s.id !== id);
      setStudents(updatedList);
      setFilteredStudents(updatedList);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditForm({ 
      name: student.name, 
      age: student.age, 
      rollNo: student.rollNo,
      subjects: [...student.subjects]
    });
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editForm.age.trim() || !editForm.rollNo.trim()) {
      setError("Please fill all required fields!");
      return;
    }
    if (isNaN(editForm.age) || editForm.age <= 0) {
      setError("Please enter a valid age (positive number)");
      return;
    }
    if (isNaN(editForm.rollNo) || editForm.rollNo <= 0) {
      setError("Please enter a valid roll number");
      return;
    }
    if (editForm.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    try {
      const res = await fetch(`/api/students?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update student");
      const updatedList = students.map((s) =>
        s.id === editingId ? { ...s, ...editForm } : s
      );
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.rollNo.toString().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectAdd = () => {
    if (newSubject && !form.subjects.includes(newSubject)) {
      setForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject]
      }));
      setNewSubject("");
    }
  };

  const handleSubjectRemove = (subjectToRemove) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  const handleEditSubjectAdd = () => {
    if (newSubject && !editForm.subjects.includes(newSubject)) {
      setEditForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject]
      }));
      setNewSubject("");
    }
  };

  const handleEditSubjectRemove = (subjectToRemove) => {
    setEditForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="text-blue-600">Student</span> Management System
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Comprehensive student records management
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or roll number"
            />
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Add New Student
          </h2>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border text-gray-900"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                min="1"
                value={form.age}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border text-gray-900"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="number"
                name="rollNo"
                min="1"
                value={form.rollNo}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border text-gray-900"
                placeholder="Roll number"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.subjects.map((subject) => (
                <span 
                  key={subject} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => handleSubjectRemove(subject)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove subject</span>
                    <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="block w-1/2 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border text-gray-900"
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSubjectAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Subject
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={addStudent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Student List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Student Records
            </h2>
            <span className="text-sm text-gray-600">
              {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No students found
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {searchTerm.trim()
                  ? "Try a different search term"
                  : "Add a new student to get started"}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      {editingId === student.id ? (
                        <div className="w-full">
                          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-2 border text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age
                              </label>
                              <input
                                type="number"
                                name="age"
                                min="1"
                                value={editForm.age}
                                onChange={handleEditInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-2 border text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Roll No
                              </label>
                              <input
                                type="number"
                                name="rollNo"
                                min="1"
                                value={editForm.rollNo}
                                onChange={handleEditInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-2 border text-gray-900"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subjects
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editForm.subjects.map((subject) => (
                                <span 
                                  key={subject} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {subject}
                                  <button
                                    type="button"
                                    onClick={() => handleEditSubjectRemove(subject)}
                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                                  >
                                    <span className="sr-only">Remove subject</span>
                                    <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex">
                              <select
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                className="block w-1/2 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border text-gray-900"
                              >
                                <option value="">Select a subject</option>
                                {subjectOptions.map((subject) => (
                                  <option key={subject} value={subject}>{subject}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={handleEditSubjectAdd}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Add Subject
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {student.name}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                <p className="text-sm text-gray-600">
                                  Age: {student.age}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Roll No: {student.rollNo}
                                </p>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {student.subjects.map((subject) => (
                                  <span 
                                    key={subject} 
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex space-x-2">
                        {editingId === student.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(student)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}