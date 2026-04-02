/**
 * doctorModal.js — doctor profile cards open the shared [data-service-modal] dialog.
 * Requires initServiceModal() to run first (sets sharedModalRefs).
 */

import { openSharedModalDetail } from "./serviceModal.js";

const DOCTOR_PROFILES = {
  emily: {
    title: "Dr. Emily Smith",
    badge: "Cardiology",
    badgeMod: "sky",
    icon: "ri-heart-pulse-line",
    short:
      "Board-certified cardiologist focused on prevention, clear risk communication, and coordinated follow-up.",
    detail:
      "Dr. Smith partners with patients on blood pressure, cholesterol, and heart rhythm concerns, with emphasis on lifestyle changes alongside evidence-based treatment. She collaborates closely with imaging and rehab teams so your care plan stays consistent visit to visit.",
    image: "/public/assets/doctor-1.jpg",
    imageAlt: "Portrait of Dr. Emily Smith",
  },
  james: {
    title: "Dr. James Anderson",
    badge: "Neurosurgery",
    badgeMod: "violet",
    icon: "ri-brain-line",
    short:
      "Complex spine and brain care with careful explanation of options, risks, and expected recovery.",
    detail:
      "Dr. Anderson supports patients through diagnosis, conservative options when appropriate, and surgical planning when needed. He prioritizes shared decision-making and works with neurology and pain specialists for seamless transitions after procedures.",
    image: "/public/assets/doctor-2.jpg",
    imageAlt: "Portrait of Dr. James Anderson",
  },
  michael: {
    title: "Dr. Michael Lee",
    badge: "Dermatology",
    badgeMod: "emerald",
    icon: "ri-medicine-bottle-line",
    short:
      "Medical and surgical dermatology with a focus on skin cancer screening and chronic skin conditions.",
    detail:
      "Dr. Lee provides full-body skin exams, acne and eczema management, and minor surgical dermatology. Treatment plans are tailored to your skin type, medications, and goals, with plain-language education at every step.",
    image: "/public/assets/doctor-3.jpg",
    imageAlt: "Portrait of Dr. Michael Lee",
  },
  sarah: {
    title: "Dr. Sarah Chen",
    badge: "Internal medicine",
    badgeMod: "teal",
    icon: "ri-stethoscope-line",
    short:
      "Primary care for adults—annual wellness, chronic disease management, and coordinated referrals.",
    detail:
      "Dr. Chen helps patients navigate complex medication lists, preventive screenings, and transitions between specialists. She emphasizes proactive outreach and timely follow-up after labs or hospital visits.",
    image: "/public/assets/about.jpg",
    imageAlt: "Portrait of Dr. Sarah Chen",
  },
  david: {
    title: "Dr. David Okonkwo",
    badge: "Orthopedics",
    badgeMod: "amber",
    icon: "ri-body-scan-line",
    short:
      "Sports injuries, joint pain, and post-injury rehab planning with a focus on mobility and strength.",
    detail:
      "Dr. Okonkwo evaluates shoulder, knee, and hip complaints with shared decision-making around imaging, injections, therapy, or surgery. He coordinates closely with physical therapy for return-to-activity timelines.",
    image: "/public/assets/choose-us.jpg",
    imageAlt: "Portrait of Dr. David Okonkwo",
  },
  priya: {
    title: "Dr. Priya Nair",
    badge: "Family medicine",
    badgeMod: "sky",
    icon: "ri-user-heart-line",
    short:
      "Whole-family care from adolescents through older adults, including vaccines and same-week sick visits.",
    detail:
      "Dr. Nair provides continuity across generations in one household when possible, with emphasis on prevention and mental health screening. She helps families understand when urgent care is appropriate versus an ER visit.",
    image: "/public/assets/doctor-1.jpg",
    imageAlt: "Portrait of Dr. Priya Nair",
  },
  ana: {
    title: "Dr. Ana Ruiz",
    badge: "Pediatrics",
    badgeMod: "emerald",
    icon: "ri-parent-line",
    short:
      "Childhood growth, development, and immunizations with family-friendly communication.",
    detail:
      "Dr. Ruiz supports new parents, school-age children, and teens with evidence-based guidance on nutrition, sleep, and behavior. She coordinates with schools and specialists when additional support is needed.",
    image: "/public/assets/doctor-2.jpg",
    imageAlt: "Portrait of Dr. Ana Ruiz",
  },
  tom: {
    title: "Dr. Tom Walsh",
    badge: "General surgery",
    badgeMod: "violet",
    icon: "ri-surgical-mask-line",
    short:
      "Preoperative education and postoperative recovery planning for common surgical procedures.",
    detail:
      "Dr. Walsh explains what to expect before and after surgery, including pain management and wound care. He works with anesthesia, nursing, and primary care to reduce complications and streamline discharge instructions.",
    image: "/public/assets/doctor-3.jpg",
    imageAlt: "Portrait of Dr. Tom Walsh",
  },
};

/**
 * @param {ParentNode} [root=document]
 */
export function initDoctorModal(root = document) {
  root.querySelectorAll("[data-doctor-open]").forEach((el) => {
    const card = /** @type {HTMLElement} */ (el);

    card.addEventListener("click", (e) => {
      const t = e.target;
      if (t instanceof Element && t.closest("button, a")) {
        return;
      }
      const id = card.getAttribute("data-doctor-open");
      if (!id) {
        return;
      }
      const profile = DOCTOR_PROFILES[/** @type {keyof typeof DOCTOR_PROFILES} */ (id)];
      if (profile) {
        openSharedModalDetail(profile);
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") {
        return;
      }
      e.preventDefault();
      const id = card.getAttribute("data-doctor-open");
      if (!id) {
        return;
      }
      const profile = DOCTOR_PROFILES[/** @type {keyof typeof DOCTOR_PROFILES} */ (id)];
      if (profile) {
        openSharedModalDetail(profile);
      }
    });
  });
}
