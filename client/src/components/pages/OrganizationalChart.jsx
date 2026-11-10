import React from 'react';
import './OrganizationalChart.css'; // CSS ফাইলটি ইমপোর্ট করুন

export default function OrganizationalChart() {
  return (
    <div className="org-container">
      <h2 className="org-main-title">
        Madrasatuz Zaytuna<br />International
      </h2>

      <div className="org-tree">
        {/* ================= TOP LEVEL ================= */}
        <div className="org-top-level">
          
          {/* Chairman & Advisory */}
          <div className="org-node-wrapper">
            <div className="org-box dark-green">
              <i className="fa-solid fa-users"></i> Chairman <br /> <small>(Founder)</small>
            </div>
            {/* Advisory Board (Dashed line connection) */}
            <div className="org-advisory">
              <div className="dashed-line"></div>
              <div className="org-box light-green advisory-box">
                <i className="fa-solid fa-user-group"></i> Advisory Board
              </div>
            </div>
          </div>
          <div className="org-connector vertical"></div>

          {/* CEO */}
          <div className="org-box dark-green">
            <i className="fa-solid fa-user-tie"></i> CEO
          </div>
          <div className="org-connector vertical"></div>

          {/* Principal */}
          <div className="org-box dark-green">
            <i className="fa-solid fa-user-graduate"></i> Principal
          </div>
          <div className="org-connector vertical"></div>

          {/* Vice Principal */}
          <div className="org-box light-green vice-principal">
            <i className="fa-solid fa-user"></i> Vice Principal
          </div>
        </div>

        {/* ================= BRANCHING LINE ================= */}
        <div className="org-branch-connector">
          <div className="branch-line-vertical"></div>
          <div className="branch-line-horizontal"></div>
        </div>

        {/* ================= DEPARTMENTS (6 Columns) ================= */}
        <div className="org-departments-grid">
          
          {/* Column 1: Academic */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-graduation-cap"></i> Academic Coordinator
            </div>
            <div className="org-box light-yellow">Curriculum & Academic Planning</div>
            <div className="org-box light-yellow">Teacher Development & Training</div>
            <div className="org-box light-yellow">Academic Quality Assurance</div>
          </div>

          {/* Column 2: Hifz */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-book-quran"></i> Head of Hifz Department
            </div>
            <div className="org-box light-yellow">Hifz Teachers <br/>(Halaqa 8-10)</div>
            <div className="org-box light-yellow">Tahfeez Program & Assessment</div>
          </div>

          {/* Column 3: Admission */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-bullhorn"></i> Admission & Communication Officer
            </div>
            <div className="org-box light-yellow">Admissions & Enquiries</div>
            <div className="org-box light-yellow">Marketing & Outreach</div>
            <div className="org-box light-yellow">Communication & Public Relations</div>
          </div>

          {/* Column 4: Accountant & Procurement */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-calculator"></i> Accountant
            </div>
            <div className="org-box light-yellow">Finance & Accounts <br/>(Budget & Planning)</div>
            
            <div className="org-connector vertical short"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-cart-shopping"></i> Procurement Officer
            </div>
            <div className="org-box light-yellow">Purchasing & Supplies</div>
            <div className="org-box light-yellow">Vendor Management</div>
          </div>

          {/* Column 5: Admin & Support Staff */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-gear"></i> Administration & HR Officer
            </div>
            <div className="org-box light-yellow">HR Management</div>
            <div className="org-box light-yellow">Administration & Facilities</div>
            <div className="org-box light-yellow">Records & Support Services</div>
            
            <div className="org-connector vertical short"></div>
            <div className="org-box light-green support-head">
              <i className="fa-solid fa-users-gear"></i> Support Staff
            </div>
            {/* Support Staff Grid */}
            <div className="support-staff-grid">
              <div className="org-box light-yellow small-box">Security Guard</div>
              <div className="org-box light-yellow small-box">Cleaner</div>
              <div className="org-box light-yellow small-box">Maintenance Staff</div>
              <div className="org-box light-yellow small-box">Transport Coordinator</div>
              <div className="org-box light-yellow small-box">Health & Safety Officer</div>
            </div>
          </div>

          {/* Column 6: IT & Media */}
          <div className="org-dept-col">
            <div className="dept-connector"></div>
            <div className="org-box dark-green dept-head">
              <i className="fa-solid fa-computer"></i> Head of IT & Media
            </div>
            <div className="org-box light-yellow">IT Support & Digital Systems</div>
            <div className="org-box light-yellow">Media & Content Creation</div>
            <div className="org-box light-yellow">Website & Online Platforms</div>
          </div>

        </div>
      </div>
    </div>
  );
}