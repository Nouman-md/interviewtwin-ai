import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

import {
  Mail,
  Phone,
  Briefcase,
  Target,
  Edit2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Camera,
  Trash2,
  Upload,
  User,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    currentRole: '',
    targetRole: '',
    yearsOfExperience: 0,
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    loadProfile();
    loadProfilePicture();

    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.getProfile();
      const data = response.data;

      setProfile(data);

      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        currentRole: data.currentRole || '',
        targetRole: data.targetRole || '',
        yearsOfExperience: data.yearsOfExperience ?? 0,
        bio: data.bio || '',
      });
    } catch (err) {
      console.error('Profile loading error:', err);

      setError(
        err.response?.data?.message ||
          'Failed to load profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProfilePicture = async () => {
    try {
      const response = await userAPI.getProfilePicture();
      const blobUrl = URL.createObjectURL(response.data);

      setProfileImageUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }

        return blobUrl;
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Profile picture error:', err);
      }

      setProfileImageUrl(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStartEditing = () => {
    if (!profile) return;

    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      currentRole: profile.currentRole || '',
      targetRole: profile.targetRole || '',
      yearsOfExperience: profile.yearsOfExperience ?? 0,
      bio: profile.bio || '',
    });

    setError('');
    setSuccess('');
    setEditing(true);
  };

  const handleCancelEditing = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        currentRole: profile.currentRole || '',
        targetRole: profile.targetRole || '',
        yearsOfExperience: profile.yearsOfExperience ?? 0,
        bio: profile.bio || '',
      });
    }

    setEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!user?.userId) {
      setError('Unable to identify your account.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await userAPI.updateUser(
        user.userId,
        formData
      );

      const updatedProfile = response.data;

      setProfile(updatedProfile);

      setFormData({
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        phone: updatedProfile.phone || '',
        currentRole: updatedProfile.currentRole || '',
        targetRole: updatedProfile.targetRole || '',
        yearsOfExperience:
          updatedProfile.yearsOfExperience ?? 0,
        bio: updatedProfile.bio || '',
      });

      setEditing(false);

      setSuccess('Profile updated successfully!');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);

      setError(
        err.response?.data?.message ||
          'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChoosePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    setError('');
    setSuccess('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Only JPG, PNG and WebP images are allowed.'
      );
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        'Profile picture must be smaller than 2 MB.'
      );
      return;
    }

    try {
      setUploadingPhoto(true);

      const response =
        await userAPI.uploadProfilePicture(file);

      if (response.data?.user) {
        setProfile(response.data.user);
      }

      await loadProfile();
      await loadProfilePicture();

      setSuccess(
        'Profile picture updated successfully!'
      );

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error(
        'Profile picture upload error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to upload profile picture.'
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove your profile picture?'
    );

    if (!confirmed) return;

    try {
      setRemovingPhoto(true);
      setError('');
      setSuccess('');

      await userAPI.removeProfilePicture();

      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }

      setProfileImageUrl(null);

      await loadProfile();

      setSuccess(
        'Profile picture removed successfully!'
      );

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error(
        'Remove profile picture error:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to remove profile picture.'
      );
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.userId) {
      setError('Unable to identify your account.');
      return;
    }

    try {
      setDeletingAccount(true);
      setError('');

      await userAPI.deleteUser(user.userId);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }

      window.location.href = '/login';
    } catch (err) {
      console.error('Delete account error:', err);

      setError(
        err.response?.data?.message ||
          'Failed to delete account. Please try again.'
      );

      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const getInitials = () => {
    if (!profile) return 'U';

    const first = profile.firstName?.charAt(0) || '';
    const last = profile.lastName?.charAt(0) || '';

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || 'U';
  };

  const getDisplayName = () => {
    if (!profile) return 'User';

    if (profile.fullName) {
      return profile.fullName;
    }

    const name =
      `${profile.firstName || ''} ${
        profile.lastName || ''
      }`.trim();

    return name || 'User';
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.currentRole,
      profile.targetRole,
      profile.yearsOfExperience !== null &&
      profile.yearsOfExperience !== undefined
        ? String(profile.yearsOfExperience)
        : '',
      profile.bio,
    ];

    const completed = fields.filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="
              w-12 h-12 rounded-full border-4
              border-blue-500/20 border-t-blue-500
              animate-spin mx-auto
            "
          />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">

      {/* PAGE HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="
          flex flex-col md:flex-row
          md:items-end md:justify-between
          gap-6 mb-8
        "
      >
        <div>
          <div
            className="
              inline-flex items-center gap-2
              px-3 py-1.5 rounded-full
              bg-blue-500/10
              text-blue-600 dark:text-blue-400
              text-xs font-bold mb-4
            "
          >
            <User size={14} />
            ACCOUNT
          </div>

          <h1
            className="
              text-4xl md:text-5xl font-black
              tracking-tight
              text-gray-950 dark:text-white
            "
          >
            My Profile
          </h1>

          <p
            className="
              mt-3 text-gray-500
              dark:text-gray-400 max-w-xl
            "
          >
            Manage your personal information,
            career goals and account settings.
          </p>
        </div>

        {profile && (
          <div
            className="
              w-full md:w-64 p-4 rounded-2xl
              border border-gray-200
              dark:border-white/[0.08]
              bg-white dark:bg-[#0b0f18]
              shadow-lg
            "
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="
                  text-[11px] font-bold tracking-wider
                  text-gray-500 dark:text-gray-400
                "
              >
                PROFILE COMPLETION
              </span>

              <span className="text-sm font-black text-blue-500">
                {getProfileCompletion()}%
              </span>
            </div>

            <div
              className="
                h-2 rounded-full overflow-hidden
                bg-gray-100 dark:bg-white/[0.08]
              "
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${getProfileCompletion()}%`,
                }}
                transition={{ duration: 0.8 }}
                className="
                  h-full rounded-full
                  bg-gradient-to-r
                  from-blue-500
                  via-indigo-500
                  to-violet-600
                "
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ALERTS */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              mb-6 flex items-start gap-3
              p-4 rounded-2xl border
              border-red-200 dark:border-red-500/20
              bg-red-50 dark:bg-red-500/[0.06]
            "
          >
            <AlertCircle
              size={20}
              className="flex-shrink-0 text-red-500"
            />

            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              mb-6 flex items-start gap-3
              p-4 rounded-2xl border
              border-emerald-200
              dark:border-emerald-500/20
              bg-emerald-50
              dark:bg-emerald-500/[0.06]
            "
          >
            <CheckCircle2
              size={20}
              className="flex-shrink-0 text-emerald-500"
            />

            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {profile && (
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >

          {/* =====================================================
              PREMIUM PROFILE HERO
          ===================================================== */}

          <motion.div
            variants={fadeUp}
            className="
              relative overflow-hidden
              rounded-[30px]
              border border-gray-200
              dark:border-white/[0.08]
              bg-white dark:bg-[#080c16]
              shadow-xl dark:shadow-black/30
              mb-6
            "
          >

            {/* PREMIUM CSS BACKGROUND */}
            <div
              className="
                absolute inset-x-0 top-0
                h-52 overflow-hidden
                bg-gradient-to-br
                from-[#1677ff]
                via-[#5146e5]
                to-[#9227d8]
              "
            >

              {/* Blue glow */}
              <div
                className="
                  absolute
                  -left-24 -top-28
                  w-80 h-80
                  rounded-full
                  bg-cyan-300/25
                  blur-3xl
                "
              />

              {/* Purple glow */}
              <div
                className="
                  absolute
                  -right-24 -top-32
                  w-96 h-96
                  rounded-full
                  bg-fuchsia-300/25
                  blur-3xl
                "
              />

              {/* Center glow */}
              <div
                className="
                  absolute
                  left-1/2 -top-32
                  -translate-x-1/2
                  w-80 h-80
                  rounded-full
                  bg-white/10
                  blur-3xl
                "
              />

              {/* First flowing beam */}
              <div
                className="
                  absolute
                  -left-24 top-14
                  w-[120%] h-24
                  rotate-[-8deg]
                  bg-white/[0.08]
                  blur-xl
                "
              />

              {/* Second flowing beam */}
              <div
                className="
                  absolute
                  -left-24 top-28
                  w-[120%] h-16
                  rotate-[6deg]
                  bg-cyan-200/[0.07]
                  blur-2xl
                "
              />

              {/* Bottom highlight */}
              <div
                className="
                  absolute inset-x-0 bottom-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                "
              />
            </div>

            {/* Extra floating glow */}
            <div
              className="
                pointer-events-none
                absolute -left-32 top-20
                w-64 h-64 rounded-full
                bg-blue-400/10 blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute -right-28 top-10
                w-72 h-72 rounded-full
                bg-purple-500/15 blur-3xl
              "
            />

            {/* HERO CONTENT */}
            <div
              className="
                relative pt-24
                px-6 md:px-8 pb-8
              "
            >
              <div
                className="
                  flex flex-col
                  md:flex-row
                  md:items-end
                  gap-6
                "
              >

                {/* PROFILE PHOTO */}
                <div className="relative flex-shrink-0">
                  <div
                    className="
                      w-32 h-32
                      md:w-36 md:h-36
                      p-1 rounded-[26px]
                      bg-white
                      shadow-[0_20px_50px_rgba(0,0,0,0.35)]
                    "
                  >
                    <div
                      className="
                        w-full h-full
                        rounded-[22px]
                        overflow-hidden
                        bg-gray-100
                        dark:bg-gray-800
                      "
                    >
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                            w-full h-full
                            flex items-center justify-center
                            bg-gradient-to-br
                            from-blue-500
                            via-violet-500
                            to-purple-600
                          "
                        >
                          <span
                            className="
                              text-4xl md:text-5xl
                              font-black text-white
                            "
                          >
                            {getInitials()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CAMERA */}
                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    disabled={
                      uploadingPhoto ||
                      removingPhoto
                    }
                    className="
                      absolute -right-2 -bottom-2
                      w-11 h-11 rounded-xl
                      bg-[#111827]/95
                      dark:bg-[#0b0f18]
                      border border-white/10
                      shadow-xl
                      flex items-center justify-center
                      text-white
                      hover:text-blue-400
                      hover:scale-105
                      transition
                      disabled:opacity-50
                    "
                  >
                    {uploadingPhoto ? (
                      <div
                        className="
                          w-5 h-5 rounded-full
                          border-2
                          border-blue-400/20
                          border-t-blue-400
                          animate-spin
                        "
                      />
                    ) : (
                      <Camera size={18} />
                    )}
                  </button>
                </div>

                {/* NAME / INFO */}
                <div className="flex-1 min-w-0">
                  <div
                    className="
                      flex flex-col
                      sm:flex-row
                      sm:items-center
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-3xl
                        font-black
                        text-white
                        drop-shadow-lg
                      "
                    >
                      {getDisplayName()}
                    </h2>

                    <span
                      className="
                        inline-flex w-fit
                        items-center gap-1.5
                        px-2.5 py-1
                        rounded-full
                        bg-emerald-400/15
                        border border-emerald-300/20
                        text-emerald-300
                        text-xs font-bold
                        backdrop-blur-md
                      "
                    >
                      <CheckCircle2 size={13} />
                      Active
                    </span>
                  </div>

                  <div
                    className="
                      mt-3 flex flex-wrap
                      gap-x-5 gap-y-2
                      text-sm text-white/75
                    "
                  >
                    <span className="inline-flex items-center gap-2">
                      <Mail size={14} />
                      {profile.email}
                    </span>

                    {profile.currentRole && (
                      <span className="inline-flex items-center gap-2">
                        <Briefcase size={14} />
                        {profile.currentRole}
                      </span>
                    )}
                  </div>

                  {profile.targetRole && (
                    <div
                      className="
                        inline-flex items-center gap-2
                        mt-4 px-3 py-1.5
                        rounded-xl
                        bg-white/10
                        border border-white/10
                        text-white
                        text-xs font-bold
                        backdrop-blur-md
                      "
                    >
                      <Target size={14} />
                      Target: {profile.targetRole}
                    </div>
                  )}
                </div>

                {/* EDIT PROFILE */}
                {!editing && (
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    className="
                      inline-flex items-center
                      justify-center gap-2
                      px-5 py-3
                      rounded-xl
                      bg-white
                      text-gray-950
                      text-sm font-bold
                      shadow-xl
                      hover:-translate-y-0.5
                      hover:shadow-2xl
                      transition
                    "
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* PHOTO ACTIONS */}
              <div
                className="
                  mt-6 flex flex-wrap gap-2
                  md:ml-[168px]
                "
              >
                <button
                  type="button"
                  onClick={handleChoosePhoto}
                  disabled={
                    uploadingPhoto ||
                    removingPhoto
                  }
                  className="
                    inline-flex items-center gap-2
                    px-3.5 py-2 rounded-xl
                    bg-white/10
                    border border-white/10
                    text-white
                    text-xs font-bold
                    backdrop-blur-md
                    hover:bg-white/15
                    transition
                    disabled:opacity-50
                  "
                >
                  <Upload size={14} />

                  {uploadingPhoto
                    ? 'Uploading...'
                    : 'Change Photo'}
                </button>

                {profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={
                      uploadingPhoto ||
                      removingPhoto
                    }
                    className="
                      inline-flex items-center gap-2
                      px-3.5 py-2 rounded-xl
                      bg-red-500/15
                      border border-red-300/10
                      text-red-200
                      text-xs font-bold
                      backdrop-blur-md
                      hover:bg-red-500/25
                      transition
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={14} />

                    {removingPhoto
                      ? 'Removing...'
                      : 'Remove Photo'}
                  </button>
                )}
              </div>

              <p
                className="
                  md:ml-[168px]
                  mt-2
                  text-[11px]
                  text-white/50
                "
              >
                JPG, PNG or WebP · Maximum 2 MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* PERSONAL INFORMATION */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-[26px]
              border border-gray-200
              dark:border-white/[0.08]
              bg-white dark:bg-[#0b0f18]
              p-6 md:p-8 mb-6
              shadow-sm
            "
          >
            <SectionHeader
              icon={<User size={20} className="text-blue-500" />}
              title="Personal Information"
              description="Your basic personal information"
              iconBackground="bg-blue-500/10"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editing}
              />

              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editing}
              />

              {/* EMAIL */}
              <div>
                <label
                  className="
                    block mb-2
                    text-xs font-bold uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="
                      w-full pl-11 pr-4 py-3.5
                      rounded-xl border
                      border-gray-200
                      dark:border-white/[0.06]
                      bg-gray-50
                      dark:bg-white/[0.03]
                      text-gray-500
                      dark:text-gray-400
                      text-sm outline-none
                    "
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  className="
                    block mb-2
                    text-xs font-bold uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Add phone number"
                    className={`
                      w-full pl-11 pr-4 py-3.5
                      rounded-xl border
                      outline-none text-sm transition
                      ${
                        editing
                          ? `
                            bg-white
                            dark:bg-[#080b13]
                            border-blue-300
                            dark:border-blue-500/30
                            focus:ring-4
                            focus:ring-blue-500/10
                          `
                          : `
                            bg-gray-50
                            dark:bg-white/[0.03]
                            border-gray-200
                            dark:border-white/[0.06]
                          `
                      }
                      text-gray-900
                      dark:text-white
                    `}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* CAREER INFORMATION */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-[26px]
              border border-gray-200
              dark:border-white/[0.08]
              bg-white dark:bg-[#0b0f18]
              p-6 md:p-8 mb-6
              shadow-sm
            "
          >
            <SectionHeader
              icon={
                <Briefcase
                  size={20}
                  className="text-violet-500"
                />
              }
              title="Career Information"
              description="Your professional direction"
              iconBackground="bg-violet-500/10"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                label="Current Role"
                name="currentRole"
                value={formData.currentRole}
                onChange={handleChange}
                disabled={!editing}
                icon={<Briefcase size={17} />}
                placeholder="e.g. Student"
              />

              <FormField
                label="Target Role"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                disabled={!editing}
                icon={<Target size={17} />}
                placeholder="e.g. Software Engineer"
              />

              <FormField
                label="Years of Experience"
                name="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                disabled={!editing}
              />

              {/* MEMBER SINCE */}
              <div>
                <label
                  className="
                    block mb-2
                    text-xs font-bold uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Member Since
                </label>

                <div
                  className="
                    flex items-center gap-3
                    px-4 py-3.5 rounded-xl
                    border border-gray-200
                    dark:border-white/[0.06]
                    bg-gray-50
                    dark:bg-white/[0.03]
                  "
                >
                  <Calendar
                    size={17}
                    className="text-blue-500"
                  />

                  <span
                    className="
                      text-sm
                      text-gray-600
                      dark:text-gray-300
                    "
                  >
                    {profile.createdAt
                      ? new Date(
                          profile.createdAt
                        ).toLocaleDateString(
                          undefined,
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )
                      : 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BIO */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-[26px]
              border border-gray-200
              dark:border-white/[0.08]
              bg-white dark:bg-[#0b0f18]
              p-6 md:p-8 mb-6
              shadow-sm
            "
          >
            <SectionHeader
              icon={
                <User
                  size={20}
                  className="text-emerald-500"
                />
              }
              title="About You"
              description="Tell us a little about yourself"
              iconBackground="bg-emerald-500/10"
            />

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!editing}
              placeholder="
                Tell us about yourself, your skills,
                interests and career goals...
              "
              className={`
                w-full min-h-[160px]
                resize-none px-4 py-4
                rounded-2xl border
                outline-none text-sm
                leading-7 transition
                ${
                  editing
                    ? `
                      bg-white
                      dark:bg-[#080b13]
                      border-blue-300
                      dark:border-blue-500/30
                      focus:ring-4
                      focus:ring-blue-500/10
                    `
                    : `
                      bg-gray-50
                      dark:bg-white/[0.03]
                      border-gray-200
                      dark:border-white/[0.06]
                    `
                }
                text-gray-900
                dark:text-white
              `}
            />
          </motion.div>

          {/* SAVE BAR */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="
                  sticky bottom-5 z-20 mb-6
                  p-4 rounded-2xl
                  border border-blue-200
                  dark:border-blue-500/20
                  bg-white/95
                  dark:bg-[#0b0f18]/95
                  backdrop-blur-xl
                  shadow-2xl
                "
              >
                <div
                  className="
                    flex flex-col sm:flex-row
                    sm:items-center
                    sm:justify-end gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={saving}
                    className="
                      inline-flex items-center
                      justify-center gap-2
                      px-5 py-3 rounded-xl
                      border border-gray-200
                      dark:border-white/[0.08]
                      text-gray-700
                      dark:text-gray-300
                      text-sm font-bold
                      hover:bg-gray-50
                      dark:hover:bg-white/[0.05]
                      transition
                      disabled:opacity-50
                    "
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
                      inline-flex items-center
                      justify-center gap-2
                      px-6 py-3 rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-violet-600
                      text-white
                      text-sm font-bold
                      shadow-lg
                      hover:-translate-y-0.5
                      transition
                      disabled:opacity-50
                    "
                  >
                    {saving ? (
                      <>
                        <div
                          className="
                            w-4 h-4 rounded-full
                            border-2 border-white/30
                            border-t-white
                            animate-spin
                          "
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DANGER ZONE */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-[26px]
              border border-red-200
              dark:border-red-500/20
              bg-red-50/60
              dark:bg-red-500/[0.035]
              p-6 md:p-8
            "
          >
            <div
              className="
                flex flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-6
              "
            >
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-11 h-11 rounded-xl
                      bg-red-500/10
                      flex items-center justify-center
                    "
                  >
                    <Trash2
                      size={20}
                      className="text-red-500"
                    />
                  </div>

                  <h3
                    className="
                      text-xl font-black
                      text-red-700
                      dark:text-red-400
                    "
                  >
                    Danger Zone
                  </h3>
                </div>

                <p
                  className="
                    mt-4 max-w-2xl
                    text-sm leading-6
                    text-red-700/70
                    dark:text-red-300/70
                  "
                >
                  Deleting your account is permanent.
                  Your account and associated data may
                  no longer be recoverable.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="
                  flex-shrink-0
                  inline-flex items-center
                  justify-center gap-2
                  px-5 py-3 rounded-xl
                  bg-red-600 hover:bg-red-700
                  text-white text-sm font-bold
                  shadow-lg
                  hover:-translate-y-0.5
                  transition
                "
              >
                <Trash2 size={17} />
                Delete Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[100]
              flex items-center justify-center
              p-5 bg-black/60
              backdrop-blur-sm
            "
            onClick={() => {
              if (!deletingAccount) {
                setShowDeleteModal(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                w-full max-w-md
                rounded-[26px]
                overflow-hidden
                border border-gray-200
                dark:border-white/[0.08]
                bg-white
                dark:bg-[#0b0f18]
                shadow-2xl
              "
            >
              <div
                className="
                  h-2
                  bg-gradient-to-r
                  from-red-500
                  to-red-700
                "
              />

              <div className="p-7">
                <div
                  className="
                    w-14 h-14 rounded-2xl
                    bg-red-500/10
                    flex items-center
                    justify-center mb-5
                  "
                >
                  <Trash2
                    size={25}
                    className="text-red-500"
                  />
                </div>

                <h2
                  className="
                    text-2xl font-black
                    text-gray-950
                    dark:text-white
                  "
                >
                  Delete your account?
                </h2>

                <p
                  className="
                    mt-3 text-sm leading-6
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  This action cannot be undone.
                  Your InterviewTwin account and
                  associated profile data will be
                  permanently deleted.
                </p>

                <div
                  className="
                    mt-5 p-4 rounded-2xl
                    bg-red-50
                    dark:bg-red-500/[0.06]
                    border border-red-200
                    dark:border-red-500/20
                  "
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={18}
                      className="
                        flex-shrink-0
                        text-red-500
                        mt-0.5
                      "
                    />

                    <p
                      className="
                        text-xs leading-5
                        text-red-700
                        dark:text-red-300
                      "
                    >
                      Please make sure you really want
                      to delete your account before
                      continuing.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex flex-col-reverse
                    sm:flex-row gap-3 mt-7
                  "
                >
                  <button
                    type="button"
                    disabled={deletingAccount}
                    onClick={() =>
                      setShowDeleteModal(false)
                    }
                    className="
                      flex-1 px-5 py-3.5
                      rounded-xl border
                      border-gray-200
                      dark:border-white/[0.08]
                      text-gray-700
                      dark:text-gray-300
                      text-sm font-bold
                      hover:bg-gray-50
                      dark:hover:bg-white/[0.05]
                      transition
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={deletingAccount}
                    onClick={handleDeleteAccount}
                    className="
                      flex-1 inline-flex
                      items-center justify-center
                      gap-2 px-5 py-3.5
                      rounded-xl
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      text-sm font-bold
                      shadow-lg
                      transition
                      disabled:opacity-60
                    "
                  >
                    {deletingAccount ? (
                      <>
                        <div
                          className="
                            w-4 h-4 rounded-full
                            border-2 border-white/30
                            border-t-white
                            animate-spin
                          "
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon,
  title,
  description,
  iconBackground,
}) {
  return (
    <div className="flex items-center gap-4 mb-7">
      <div
        className={`
          w-11 h-11 rounded-xl
          ${iconBackground}
          flex items-center justify-center
        `}
      >
        {icon}
      </div>

      <div>
        <h3
          className="
            text-xl font-black
            text-gray-900
            dark:text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1 text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   REUSABLE FORM FIELD
============================================================ */

function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = 'text',
  icon = null,
  placeholder = '',
}) {
  return (
    <div>
      <label
        className="
          block mb-2
          text-xs font-bold uppercase
          tracking-wider
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          min={type === 'number' ? '0' : undefined}
          className={`
            w-full
            ${icon ? 'pl-11' : 'px-4'}
            pr-4 py-3.5
            rounded-xl border
            outline-none text-sm
            transition

            ${
              disabled
                ? `
                  bg-gray-50
                  dark:bg-white/[0.03]
                  border-gray-200
                  dark:border-white/[0.06]
                `
                : `
                  bg-white
                  dark:bg-[#080b13]
                  border-blue-300
                  dark:border-blue-500/30
                  focus:ring-4
                  focus:ring-blue-500/10
                `
            }

            text-gray-900
            dark:text-white
            placeholder:text-gray-400
          `}
        />
      </div>
    </div>
  );
}