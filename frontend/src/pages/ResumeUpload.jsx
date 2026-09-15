import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
  Eye,
  Sparkles,
  FileCheck,
} from 'lucide-react';

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

const stagger = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function ResumeUpload() {
  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedResume, setSelectedResume] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewName, setPreviewName] = useState('');

  const [deletingId, setDeletingId] = useState(null);
  const [primaryId, setPrimaryId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    loadResumes();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await resumeAPI.getResumes();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setResumes(data);

      const primary = data.find(
        (resume) =>
          resume.primary === true ||
          resume.isPrimary === true ||
          resume.primaryResume === true
      );

      if (primary) {
        setPrimaryId(
          primary.resumeId ||
            primary.id
        );
      }
    } catch (err) {
      console.error(
        'Failed to load resumes:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to load resumes. Please try again.'
      );

      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const validateFile = (file) => {
    if (!file) {
      return false;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase();

    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension)
    ) {
      setError(
        'Only PDF, DOC and DOCX files are supported.'
      );

      return false;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        'Resume file must be smaller than 10 MB.'
      );

      return false;
    }

    return true;
  };

  const uploadResume = async (file) => {
    if (!validateFile(file)) {
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      await resumeAPI.upload(file);

      await loadResumes();

      showSuccess(
        'Resume uploaded successfully!'
      );
    } catch (err) {
      console.error(
        'Resume upload error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to upload resume. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file =
      event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    await uploadResume(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    await uploadResume(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleChooseFile = () => {
    if (uploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const getResumeId = (resume) => {
    return (
      resume.resumeId ||
      resume.id
    );
  };

  const getResumeName = (resume) => {
    return (
      resume.fileName ||
      resume.filename ||
      resume.originalFileName ||
      resume.name ||
      'Resume'
    );
  };

  const getResumeSize = (resume) => {
    const size =
      resume.fileSize ||
      resume.size ||
      resume.fileSizeBytes;

    if (!size) {
      return '';
    }

    const bytes = Number(size);

    if (Number.isNaN(bytes)) {
      return '';
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  const getResumeDate = (resume) => {
    const date =
      resume.createdAt ||
      resume.uploadedAt ||
      resume.updatedAt;

    if (!date) {
      return 'Recently uploaded';
    }

    const parsed =
      new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Recently uploaded';
    }

    return parsed.toLocaleDateString(
      undefined,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const isPrimaryResume = (resume) => {
    const id = getResumeId(resume);

    return (
      resume.primary === true ||
      resume.isPrimary === true ||
      resume.primaryResume === true ||
      id === primaryId
    );
  };

  const handleSetPrimary = async (resume) => {
    const id =
      getResumeId(resume);

    if (!id) {
      setError(
        'Unable to identify this resume.'
      );

      return;
    }

    try {
      setPrimaryId(id);
      setError('');

      await resumeAPI.setPrimary(id);

      await loadResumes();

      showSuccess(
        'Primary resume updated successfully!'
      );
    } catch (err) {
      console.error(
        'Set primary resume error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to set primary resume.'
      );

      await loadResumes();
    }
  };

  const handleDelete = async (resume) => {
    const id =
      getResumeId(resume);

    if (!id) {
      setError(
        'Unable to identify this resume.'
      );

      return;
    }

    const name =
      getResumeName(resume);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError('');

      await resumeAPI.deleteResume(id);

      await loadResumes();

      showSuccess(
        'Resume deleted successfully.'
      );
    } catch (err) {
      console.error(
        'Delete resume error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to delete resume.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (resume) => {
    const id =
      getResumeId(resume);

    if (!id) {
      setError(
        'Unable to identify this resume.'
      );

      return;
    }

    try {
      setDownloadingId(id);
      setError('');

      const response =
        await resumeAPI.downloadResume(id);

      const blob =
        new Blob(
          [response.data],
          {
            type:
              response.headers?.['content-type'] ||
              'application/octet-stream',
          }
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;
      link.download =
        getResumeName(resume);

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        'Download resume error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to download resume.'
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = async (resume) => {
    const id =
      getResumeId(resume);

    if (!id) {
      setError(
        'Unable to identify this resume.'
      );

      return;
    }

    const name =
      getResumeName(resume);

    const extension =
      name
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      extension !== 'pdf'
    ) {
      setError(
        'Preview is currently available for PDF resumes. Use Download for DOC/DOCX files.'
      );

      return;
    }

    try {
      setError('');

      const response =
        await resumeAPI.downloadResume(id);

      const blob =
        new Blob(
          [response.data],
          {
            type: 'application/pdf',
          }
        );

      const url =
        URL.createObjectURL(blob);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(url);
      setPreviewName(name);
    } catch (err) {
      console.error(
        'Preview resume error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to preview resume.'
      );
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewName('');
  };

  const filteredResumes =
    resumes.filter((resume) => {
      const name =
        getResumeName(resume)
          .toLowerCase();

      return name.includes(
        searchTerm.toLowerCase()
      );
    });

  const primaryResume =
    resumes.find(
      (resume) =>
        isPrimaryResume(resume)
    );

  return (
    <div className="max-w-6xl mx-auto pb-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
          flex flex-col
          md:flex-row
          md:items-end
          md:justify-between
          gap-6
          mb-8
        "
      >
        <div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-blue-500/10
              text-blue-600
              dark:text-blue-400
              text-xs
              font-bold
              mb-4
            "
          >
            <FileText size={14} />
            RESUME MANAGEMENT
          </div>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-black
              tracking-tight
              text-gray-950
              dark:text-white
            "
          >
            Your Resumes
          </h1>

          <p
            className="
              mt-3
              text-gray-500
              dark:text-gray-400
              max-w-2xl
            "
          >
            Upload, manage and organize your
            resumes for interviews, ATS analysis
            and job matching.
          </p>

        </div>

        <div
          className="
            flex items-center
            gap-3
            px-5 py-4
            rounded-2xl
            border
            border-gray-200
            dark:border-white/[0.08]
            bg-white
            dark:bg-[#0b0f18]
            shadow-sm
          "
        >
          <div
            className="
              w-10 h-10
              rounded-xl
              bg-blue-500/10
              flex items-center
              justify-center
            "
          >
            <FileCheck
              size={19}
              className="text-blue-500"
            />
          </div>

          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Total Resumes
            </p>

            <p
              className="
                text-xl
                font-black
                text-gray-900
                dark:text-white
              "
            >
              {resumes.length}
            </p>
          </div>
        </div>
      </motion.div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      <AnimatePresence>

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="
              mb-6
              flex
              items-start
              gap-3
              p-4
              rounded-2xl
              border
              border-red-200
              dark:border-red-500/20
              bg-red-50
              dark:bg-red-500/[0.06]
            "
          >
            <AlertCircle
              size={20}
              className="
                flex-shrink-0
                text-red-500
              "
            />

            <p
              className="
                text-sm
                text-red-700
                dark:text-red-300
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError('')}
              className="
                ml-auto
                text-red-400
                hover:text-red-600
              "
            >
              <X size={17} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="
              mb-6
              flex
              items-start
              gap-3
              p-4
              rounded-2xl
              border
              border-emerald-200
              dark:border-emerald-500/20
              bg-emerald-50
              dark:bg-emerald-500/[0.06]
            "
          >
            <CheckCircle2
              size={20}
              className="
                flex-shrink-0
                text-emerald-500
              "
            />

            <p
              className="
                text-sm
                text-emerald-700
                dark:text-emerald-300
              "
            >
              {success}
            </p>
          </motion.div>
        )}

      </AnimatePresence>


      {/* =====================================================
          PREMIUM UPLOAD HERO
      ===================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
          relative
          overflow-hidden
          rounded-[30px]
          mb-8
          border
          border-blue-400/20
          shadow-2xl
          dark:shadow-black/30
        "
      >

        {/* Premium gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#0969ff]
            via-[#5146e5]
            to-[#9227d8]
          "
        />

        {/* Blue glow */}

        <div
          className="
            absolute
            -left-24
            -top-28
            w-80
            h-80
            rounded-full
            bg-cyan-300/20
            blur-3xl
          "
        />

        {/* Purple glow */}

        <div
          className="
            absolute
            -right-24
            -top-32
            w-96
            h-96
            rounded-full
            bg-fuchsia-300/20
            blur-3xl
          "
        />

        {/* Light beam */}

        <div
          className="
            absolute
            -left-20
            top-20
            w-[120%]
            h-24
            rotate-[-7deg]
            bg-white/[0.08]
            blur-xl
          "
        />

        <div
          className="
            absolute
            -left-20
            top-32
            w-[120%]
            h-12
            rotate-[5deg]
            bg-cyan-200/[0.06]
            blur-2xl
          "
        />

        {/* Content */}

        <div
          className="
            relative
            z-10
            px-6
            md:px-10
            py-10
            md:py-12
          "
        >

          <div
            className="
              max-w-3xl
              mx-auto
              text-center
            "
          >

            <div
              className="
                mx-auto
                w-16
                h-16
                rounded-2xl
                bg-white/10
                border
                border-white/15
                backdrop-blur-md
                flex
                items-center
                justify-center
                mb-5
                shadow-xl
              "
            >
              <Upload
                size={29}
                className="text-white"
              />
            </div>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                text-white
              "
            >
              Upload your resume
            </h2>

            <p
              className="
                mt-3
                text-sm
                md:text-base
                text-white/75
                max-w-xl
                mx-auto
              "
            >
              Keep your resume ready for
              ATS analysis, job matching and
              AI-powered interview preparation.
            </p>


            {/* DROP ZONE */}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                mt-7
                rounded-2xl
                border-2
                border-dashed
                p-7
                md:p-9
                transition-all
                ${
                  dragging
                    ? `
                      border-white
                      bg-white/15
                      scale-[1.01]
                    `
                    : `
                      border-white/20
                      bg-white/[0.06]
                      hover:bg-white/[0.09]
                    `
                }
              `}
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <FileText
                  size={32}
                  className="
                    text-white/80
                    mb-4
                  "
                />

                <p
                  className="
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  Drag & drop your resume here
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-white/55
                  "
                >
                  or choose a file from your computer
                </p>


                <button
                  type="button"
                  onClick={handleChooseFile}
                  disabled={uploading}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3
                    rounded-xl
                    bg-white
                    text-gray-950
                    text-sm
                    font-bold
                    shadow-xl
                    hover:-translate-y-0.5
                    transition
                    disabled:opacity-60
                  "
                >

                  {uploading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Choose Resume
                    </>
                  )}

                </button>


                <p
                  className="
                    mt-4
                    text-[11px]
                    text-white/45
                  "
                >
                  PDF, DOC or DOCX · Maximum 10 MB
                </p>

              </div>

            </div>

          </div>

        </div>

      </motion.div>


      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />


      {/* =====================================================
          PRIMARY RESUME
      ===================================================== */}

      {primaryResume && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            relative
            overflow-hidden
            mb-8
            p-6
            rounded-[26px]
            border
            border-amber-200
            dark:border-amber-500/20
            bg-gradient-to-r
            from-amber-50
            to-white
            dark:from-amber-500/[0.06]
            dark:to-[#0b0f18]
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-5
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-amber-500/10
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Star
                size={25}
                className="text-amber-500"
                fill="currentColor"
              />
            </div>

            <div className="flex-1 min-w-0">

              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-wider
                  font-black
                  text-amber-600
                  dark:text-amber-400
                "
              >
                PRIMARY RESUME
              </p>

              <h3
                className="
                  mt-1
                  text-lg
                  font-black
                  text-gray-900
                  dark:text-white
                  truncate
                "
              >
                {getResumeName(primaryResume)}
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                This resume is used as your
                default resume across InterviewTwin.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                handleDownload(primaryResume)
              }
              disabled={
                downloadingId ===
                getResumeId(primaryResume)
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-gray-900
                dark:bg-white
                text-white
                dark:text-gray-900
                text-xs
                font-bold
                transition
                hover:-translate-y-0.5
                disabled:opacity-50
              "
            >
              {downloadingId ===
              getResumeId(primaryResume) ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Download size={15} />
              )}

              Download
            </button>

          </div>

        </motion.div>
      )}


      {/* =====================================================
          RESUME LIST HEADER
      ===================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-5
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-black
              text-gray-900
              dark:text-white
            "
          >
            My Resume Library
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage all your uploaded resumes.
          </p>

        </div>


        {/* SEARCH */}

        {resumes.length > 0 && (
          <div
            className="
              relative
              w-full
              sm:w-72
            "
          >

            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search resumes..."
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-white/[0.08]
                bg-white
                dark:bg-[#0b0f18]
                text-gray-900
                dark:text-white
                text-sm
                outline-none
                focus:ring-4
                focus:ring-blue-500/10
                focus:border-blue-400
                transition
              "
            />

          </div>
        )}

      </motion.div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div
          className="
            py-20
            text-center
          "
        >

          <Loader2
            size={38}
            className="
              mx-auto
              text-blue-500
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Loading your resumes...
          </p>

        </div>
      )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        resumes.length === 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="
              rounded-[28px]
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-white
              dark:bg-[#0b0f18]
              p-10
              md:p-16
              text-center
            "
          >

            <div
              className="
                mx-auto
                w-20
                h-20
                rounded-3xl
                bg-gradient-to-br
                from-blue-500/10
                to-violet-500/10
                flex
                items-center
                justify-center
              "
            >
              <FileText
                size={34}
                className="text-blue-500"
              />
            </div>

            <h3
              className="
                mt-6
                text-2xl
                font-black
                text-gray-900
                dark:text-white
              "
            >
              No resumes yet
            </h3>

            <p
              className="
                mt-3
                max-w-md
                mx-auto
                text-sm
                leading-6
                text-gray-500
                dark:text-gray-400
              "
            >
              Upload your first resume above
              to start using ATS analysis,
              job matching and resume-based
              interview features.
            </p>

            <button
              type="button"
              onClick={handleChooseFile}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-6
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                text-white
                text-sm
                font-bold
                shadow-lg
                hover:-translate-y-0.5
                transition
              "
            >
              <Upload size={17} />
              Upload Your First Resume
            </button>

          </motion.div>
        )}


      {/* =====================================================
          SEARCH EMPTY
      ===================================================== */}

      {!loading &&
        resumes.length > 0 &&
        filteredResumes.length === 0 && (
          <div
            className="
              rounded-[26px]
              border
              border-gray-200
              dark:border-white/[0.08]
              bg-white
              dark:bg-[#0b0f18]
              p-12
              text-center
            "
          >

            <Search
              size={32}
              className="
                mx-auto
                text-gray-400
              "
            />

            <h3
              className="
                mt-4
                font-black
                text-gray-900
                dark:text-white
              "
            >
              No matching resumes
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Try a different search term.
            </p>

          </div>
        )}


      {/* =====================================================
          RESUME CARDS
      ===================================================== */}

      {!loading &&
        filteredResumes.length > 0 && (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="
              grid
              md:grid-cols-2
              gap-5
            "
          >

            {filteredResumes.map(
              (resume) => {

                const id =
                  getResumeId(resume);

                const name =
                  getResumeName(resume);

                const primary =
                  isPrimaryResume(resume);

                const deleting =
                  deletingId === id;

                const downloading =
                  downloadingId === id;

                return (
                  <motion.div
                    key={id || name}
                    variants={fadeUp}
                    whileHover={{
                      y: -4,
                    }}
                    className={`
                      relative
                      overflow-hidden
                      rounded-[26px]
                      border
                      bg-white
                      dark:bg-[#0b0f18]
                      transition
                      ${
                        primary
                          ? `
                            border-amber-300
                            dark:border-amber-500/30
                          `
                          : `
                            border-gray-200
                            dark:border-white/[0.08]
                          `
                      }
                    `}
                  >

                    {/* TOP LINE */}

                    <div
                      className={`
                        h-1
                        ${
                          primary
                            ? `
                              bg-gradient-to-r
                              from-amber-400
                              to-orange-500
                            `
                            : `
                              bg-gradient-to-r
                              from-blue-500
                              to-violet-600
                            `
                        }
                      `}
                    />

                    <div className="p-6">

                      {/* CARD HEADER */}

                      <div
                        className="
                          flex
                          items-start
                          gap-4
                        "
                      >

                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-500/10
                            to-violet-500/10
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          "
                        >
                          <FileText
                            size={27}
                            className="text-blue-500"
                          />
                        </div>


                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-2
                            "
                          >

                            <h3
                              className="
                                font-black
                                text-gray-900
                                dark:text-white
                                truncate
                              "
                              title={name}
                            >
                              {name}
                            </h3>

                            {primary && (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  px-2
                                  py-1
                                  rounded-full
                                  bg-amber-500/10
                                  text-amber-600
                                  dark:text-amber-400
                                  text-[10px]
                                  font-black
                                  flex-shrink-0
                                "
                              >
                                <Star
                                  size={10}
                                  fill="currentColor"
                                />
                                PRIMARY
                              </span>
                            )}

                          </div>


                          <p
                            className="
                              mt-2
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {getResumeSize(resume)}
                            {getResumeSize(resume) &&
                              ' · '}
                            Uploaded{' '}
                            {getResumeDate(resume)}
                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div
                        className="
                          mt-5
                          flex
                          items-center
                          gap-2
                          px-3
                          py-2.5
                          rounded-xl
                          bg-gray-50
                          dark:bg-white/[0.03]
                        "
                      >

                        <CheckCircle2
                          size={15}
                          className="
                            text-emerald-500
                            flex-shrink-0
                          "
                        />

                        <span
                          className="
                            text-xs
                            font-semibold
                            text-gray-600
                            dark:text-gray-300
                          "
                        >
                          Resume uploaded and ready
                        </span>

                      </div>


                      {/* ACTIONS */}

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handlePreview(resume)
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-2.5
                            rounded-xl
                            border
                            border-gray-200
                            dark:border-white/[0.08]
                            text-gray-700
                            dark:text-gray-300
                            text-xs
                            font-bold
                            hover:bg-gray-50
                            dark:hover:bg-white/[0.05]
                            transition
                          "
                        >
                          <Eye size={15} />
                          Preview
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDownload(resume)
                          }
                          disabled={downloading}
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            text-xs
                            font-bold
                            transition
                            disabled:opacity-50
                          "
                        >
                          {downloading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Download size={15} />
                          )}

                          Download
                        </button>

                      </div>


                      {/* SECONDARY ACTIONS */}

                      <div
                        className="
                          mt-2
                          grid
                          grid-cols-2
                          gap-2
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleSetPrimary(resume)
                          }
                          disabled={primary}
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-2.5
                            rounded-xl
                            text-xs
                            font-bold
                            transition
                            disabled:cursor-default
                            disabled:opacity-50
                            bg-amber-500/10
                            text-amber-600
                            dark:text-amber-400
                            hover:bg-amber-500/15
                          "
                        >
                          <Star
                            size={15}
                            fill={
                              primary
                                ? 'currentColor'
                                : 'none'
                            }
                          />

                          {primary
                            ? 'Primary Resume'
                            : 'Set as Primary'}
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(resume)
                          }
                          disabled={deleting}
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3
                            py-2.5
                            rounded-xl
                            bg-red-500/10
                            text-red-600
                            dark:text-red-400
                            text-xs
                            font-bold
                            hover:bg-red-500/15
                            transition
                            disabled:opacity-50
                          "
                        >
                          {deleting ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}

                          Delete
                        </button>

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )}

          </motion.div>
        )}


      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
          mt-8
          rounded-[26px]
          border
          border-blue-200
          dark:border-blue-500/20
          bg-blue-50/60
          dark:bg-blue-500/[0.04]
          p-6
        "
      >

        <div
          className="
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-blue-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <Sparkles
              size={20}
              className="text-blue-500"
            />
          </div>

          <div>

            <h3
              className="
                font-black
                text-gray-900
                dark:text-white
              "
            >
              Make your resume work harder
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              Keep your most relevant resume
              selected as primary. You can then
              use it for ATS analysis, job matching
              and resume-based interview preparation.
            </p>

          </div>

        </div>

      </motion.div>

      {/* =====================================================
          PDF PREVIEW MODAL
      ===================================================== */}

      <AnimatePresence>

        {previewUrl && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[100]
              bg-black/70
              backdrop-blur-sm
              p-4
              md:p-8
              flex
              items-center
              justify-center
            "
            onClick={closePreview}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                w-full
                max-w-6xl
                h-[90vh]
                rounded-2xl
                overflow-hidden
                bg-white
                dark:bg-[#0b0f18]
                shadow-2xl
                flex
                flex-col
              "
            >

              {/* MODAL HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-4
                  border-b
                  border-gray-200
                  dark:border-white/[0.08]
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-red-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FileText
                      size={18}
                      className="text-red-500"
                    />
                  </div>

                  <div className="min-w-0">

                    <p
                      className="
                        text-sm
                        font-black
                        text-gray-900
                        dark:text-white
                        truncate
                      "
                    >
                      {previewName}
                    </p>

                    <p
                      className="
                        text-[11px]
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Resume Preview
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={closePreview}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:text-gray-900
                    dark:hover:text-white
                    hover:bg-gray-100
                    dark:hover:bg-white/[0.06]
                    transition
                  "
                >
                  <X size={19} />
                </button>

              </div>


              {/* PDF */}

              <div
                className="
                  flex-1
                  bg-gray-100
                  dark:bg-gray-900
                "
              >

                <iframe
                  src={previewUrl}
                  title={previewName}
                  className="
                    w-full
                    h-full
                    border-0
                  "
                />

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}