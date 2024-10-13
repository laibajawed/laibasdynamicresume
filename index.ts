document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form') as HTMLFormElement;
    const editBtn = document.getElementById('edit-btn') as HTMLButtonElement;
    const downloadBtn = document.getElementById('download-pdf') as HTMLButtonElement;
    const generateUrlBtn = document.getElementById('generate-url') as HTMLButtonElement;
    const resumeSection = document.getElementById('resume-content');
    let isEditing = false;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get data from form
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const education = (document.getElementById('education') as HTMLTextAreaElement).value;
        const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
        const skills = (document.getElementById('skills') as HTMLInputElement).value.split(',');
        const profilePic = (document.getElementById('profile-pic') as HTMLInputElement).files?.[0];
        
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
            }
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
            } else {
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
                name: (document.getElementById('name') as HTMLInputElement).value,
                email: (document.getElementById('email') as HTMLInputElement).value,
                education: (document.getElementById('education') as HTMLTextAreaElement).value,
                experience: (document.getElementById('experience') as HTMLTextAreaElement).value,
                skills: (document.getElementById('skills') as HTMLInputElement).value.split(',')
            }));
            prompt('Copy this URL to share:', url.href);
        });
    }
});