import { jsPDF } from "jspdf";
import { generate as generateLang } from "~/constants/locale";

const generateCV = ({ data = {}, lang = "id" }) => {
  let space = 20;
  const constant = generateLang[lang].pdf;

  const doc = new jsPDF({
    orientation: "p",
    lineHeight: 1.5,
    unit: "mm",
    format: [210, 297],
  });

  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  const pageCenterX = pageWidth / 2;
  const pageTextStart = 12.7;
  const pageTextEnd = pageWidth - 12.7;
  const maxWidth = pageWidth - pageTextStart * 2;

  // helpers
  const text = {
    italic: (e, x = pageTextStart, y = space, opts = {}) => {
      doc.setFont("helvetica", "italic", "normal");
      doc.text(e, x, y, opts);
    },
    normal: (e, x = pageTextStart, y = space, opts = {}) => {
      doc.setFont("helvetica", "normal", "normal");
      doc.text(e, x, y, opts);
    },
    title: (e, x = pageTextStart, y = space, opts = {}) => {
      doc.setFont("helvetica", "normal", "bold");
      doc.text(e, x, y, opts);
    },
  };

  const drawLine = (y) => {
    doc.line(pageTextStart, y, pageWidth - pageTextStart, y);
  };

  const newSectionTitle = (content) => {
    space += 4;
    doc.setFontSize(11);
    text.title(content, pageTextStart, space);

    space += 2;
    drawLine(space);

    doc.setFont("helvetica", "normal", "normal");
    space += 6;
    doc.setFontSize(11);
  };

  const newDescriptionText = (
    content,
    { justify = false, list = false } = {},
  ) => {
    let x = pageTextStart;
    let splitText = doc.splitTextToSize(content, maxWidth);

    if (list) {
      // prefix
      doc.text("-", x + 2, space);

      // adjust content start
      const addSize = 6;
      x += addSize;
      splitText = doc.splitTextToSize(content, maxWidth - addSize);
    }
    text.normal(splitText, x, space, {
      align: justify ? "justify" : "left",
      maxWidth,
    });

    // calc height of content
    const lineHeight = doc.getFontSize() * doc.getLineHeightFactor() * 0.352778;
    const totalHeight = splitText.length * lineHeight;
    space += totalHeight;
  };

  const newContent = ({
    title,
    start_date = null,
    end_date = constant.now,
    company = null,
    description = "",
    type,
  }) => {
    doc.setFontSize(11);
    text.title(title, pageTextStart, space);
    if (start_date) {
      text.normal(`${start_date} - ${end_date}`, pageTextEnd, space, "right");
    }
    space += 4;
    doc.setFontSize(10);
    text.italic(company + (type ? " - " + type : ""), pageTextStart, space);
    doc.setFontSize(11);
    space += 6;
    if (description) {
      if (Array.isArray(description)) {
        description.forEach((e) => newDescriptionText(e, { list: true }));
      } else {
        newDescriptionText(description);
      }
    }
  };

  // sections
  const sectionProfile = () => {
    const subtitle = [
      data.address,
      data.phone_number,
      data.email,
      data.linkedin,
    ]
      .filter(Boolean)
      .join(" | ");

    doc.setFontSize(15);
    text.title(data.name);

    space += 6;
    doc.setFontSize(10);
    text.normal(subtitle);
    space += 6;
  };

  const sectionSummary = () => {
    newSectionTitle(constant.summary);
    newDescriptionText(data.summary, { justify: true });
  };

  const sectionBody = ({ title, data }) => {
    newSectionTitle(title);
    data.forEach((e) => newContent(e));
  };

  const sectionSkill = () => {
    newSectionTitle(constant.skillAndInterest);

    if (data.skill.length) {
      text.title(constant.skill);
      space += 6;
      newDescriptionText(data.skill.join(", "));
    }

    if (data.interest.length) {
      text.title(constant.interest);
      space += 6;
      newDescriptionText(data.interest.join(", "));
    }
  };

  // main
  sectionProfile();
  sectionSummary();
  if (data.experience.length)
    sectionBody({ title: constant.experience, data: data.experience });
  if (data.education.length)
    sectionBody({ title: constant.education, data: data.education });
  if (data.project.length)
    sectionBody({ title: constant.project, data: data.project });
  if (data.organization.length)
    sectionBody({ title: constant.organization, data: data.organization });
  if (data.award.length)
    sectionBody({ title: constant.award, data: data.award });
  if (data.skill.length || data.interest.length) sectionSkill();
  // doc.save('a4.pdf');
  doc.output("dataurlnewwindow", { filename: "cv-alphonsus.pdf" });
};

export default generateCV;
