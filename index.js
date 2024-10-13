"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const editBtn = document.getElementById('edit-btn');
    const downloadBtn = document.getElementById('download-pdf');
    const generateUrlBtn = document.getElementById('generate-url');
    const resumeSection = document.getElementById('resume-content');
    let isEditing = false;
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Get data from form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const education = document.getElementById('education').value;
        const experience = document.getElementById('experience').value;
        const skills = document.getElementById('skills').value.split(',');
        const profilePic = document.getElementById('profile-pic').files?.[0];
        // generation of resume
        if (resumeSection) {
            const reader = new FileReader();
            reader.onloadend = () => {
                resumeSection.innerHTML = `
                    <img src="${reader.result}" alt="Profile Picture">
                    <h2>${name}'s Resume</h2>
                    <p class="editable" contenteditable="false">Email: ${email}</p>
                    <h3>Education</h3>
                    <p class="editable" contenteditable="false">${education}</p>
                    <h3>Work Experience</h3>
                    <p class="editable" contenteditable="false">${experience}</p>
                    <h3>Skills</h3>
                    <ul>
                        ${skills.map(skill => `<li class="editable" contenteditable="false">${skill.trim()}</li>`).join('')}
                    </ul>
                `;
            };
            if (profilePic) {
                reader.readAsDataURL(profilePic);
            }
        }
    });
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const editableElements = document.querySelectorAll('.editable');
            if (isEditing) {
                // Save changes
                editableElements.forEach(element => {
                    element.setAttribute('contenteditable', 'false');
                });
                editBtn.textContent = 'Edit';
            }
            else {
                // editable
                editableElements.forEach(element => {
                    element.setAttribute('contenteditable', 'true');
                });
                editBtn.textContent = 'Save';
            }
            isEditing = !isEditing;
        });
    }
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (resumeSection) {
                const opt = {
                    margin: 1,
                    filename: 'resume.pdf',
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "letter", orientation: 'portrait' }
                };
                html2pdf().from(resumeSection).set(opt).save();
            }
        });
    }
    if (generateUrlBtn) {
        generateUrlBtn.addEventListener('click', () => {
            const url = new URL(window.location.href);
            url.searchParams.set('resume', JSON.stringify({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                education: document.getElementById('education').value,
                experience: document.getElementById('experience').value,
                skills: document.getElementById('skills').value.split(',')
            }));
            prompt('Copy this URL to share:', url.href);
        });
    }
});
