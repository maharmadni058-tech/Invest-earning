import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseModule } from '../types';
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Award,
  Clock,
  UserCheck,
  Download,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { courses, currentUser, plans } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase">
              Curriculum Hub
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">High-Income Pakistani Skills</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 font-display">
            ACADEMY COURSES &amp; SYLLABUS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Practical video lectures, proposal scripts, and case studies taught by Pakistan's top-earning freelancers and agency owners.
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171924] hover:bg-[#202333] border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>View Verified Certificate</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const matchingPlan = plans.find((p) => p.id === course.tier);
          const isUnlocked = Boolean(currentUser.currentPlanId);

          return (
            <div
              key={course.id}
              className="rounded-2xl bg-[#12141e] border border-zinc-800 hover:border-amber-500/40 overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                {/* Thumbnail banner */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141e] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase font-mono">
                    {course.tier.toUpperCase()} TIER COURSE
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-200">
                    <span className="flex items-center gap-1 font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {course.duration}
                    </span>
                    <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded">
                      {course.lessons.length} Modules
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instructor: <strong>{course.instructor}</strong></span>
                  </p>

                  {/* Lessons Preview */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                      Curriculum Modules:
                    </span>
                    {course.lessons.slice(0, 3).map((l, i) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between text-xs text-zinc-300 bg-zinc-900/60 px-3 py-1.5 rounded-lg"
                      >
                        <span className="truncate pr-2">{l.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono flex-shrink-0">{l.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveLessonIndex(0);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <PlayCircle className="w-4 h-4 fill-black text-amber-400" />
                  <span>Start Course Lessons</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#11131c] border border-amber-500/30 shadow-2xl overflow-hidden">
            {/* Player Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#090a10]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md font-display">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video screen simulator */}
            <div className="bg-black relative aspect-video flex items-center justify-center border-b border-zinc-800">
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400 cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 fill-amber-400 text-black" />
                </div>
                <p className="text-sm font-bold text-white mt-2">
                  {selectedCourse.lessons[activeLessonIndex]?.title || 'Lesson Stream'}
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                  Duration: {selectedCourse.lessons[activeLessonIndex]?.duration || '25 min'} • HD 1080p Stream
                </p>
              </div>
            </div>

            {/* Lessons List below player */}
            <div className="p-4 overflow-y-auto max-h-60 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                Course Playlist ({selectedCourse.lessons.length} Lessons)
              </h4>
              <div className="space-y-1">
                {selectedCourse.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                      activeLessonIndex === idx
                        ? 'bg-amber-500/20 border border-amber-400 text-white font-bold'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-zinc-500">#{idx + 1}</span>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 flex-shrink-0 ml-2">
                      {lesson.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Generator Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0e1017] border-2 border-amber-500/40 p-4 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-lg text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Canvas Mock */}
            <div className="border-2 sm:border-4 border-amber-500/40 p-3.5 sm:p-6 rounded-xl bg-gradient-to-br from-[#161822] via-[#0d0f15] to-[#141620] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-8 h-8 text-amber-400" />
                <span className="text-xl font-bold tracking-widest gold-gradient-text uppercase font-display">
                  LEARN TO EARN GOLD ACADEMY
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                Official Certification of Skill Completion &amp; Proficiency
              </p>

              <div className="my-6">
                <p className="text-xs text-zinc-400 italic">This is proudly conferred upon</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display tracking-wider">
                  {currentUser.fullName}
                </h2>
                <p className="text-xs text-amber-300 font-mono mt-1">
                  Student ID: {currentUser.id.toUpperCase()} • Verified Mobile: {currentUser.phone}
                </p>
              </div>

              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                For successfully fulfilling the professional curriculum requirements in <strong>Digital Freelancing, E-Commerce Execution &amp; Verified Practical Skill Tasks</strong> with honors.
              </p>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-800 text-left text-[11px] text-zinc-400 font-mono">
                <div>
                  <p className="text-white font-bold">Director of Curriculum</p>
                  <p>Hamza Farooq, Senior Lead</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 text-[9px] font-bold">
                    SEAL
                  </div>
                  <p className="text-[9px] text-amber-300 mt-1">100% VERIFIED</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">Issue Date</p>
                  <p>{new Date().toISOString().split('T')[0]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
