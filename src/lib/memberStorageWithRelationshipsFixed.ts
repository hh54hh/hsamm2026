import { Member, Course, DietPlan } from "./types";
import { supabase } from "./supabase";
import {
  updateMemberWithRelationships,
  assignCourseToMember,
  assignDietPlanToMember,
  removeCourseFromMember,
  removeDietPlanFromMember,
  getAllMembersWithRelationships,
  getMemberWithRelationships,
} from "./memberRelationships";
import unifiedDB from "./unified-database";
import gymDB from "./database";

// Track ongoing operations to prevent infinite loops
const ongoingOperations = new Set<string>();
const recentlySaved = new Map<string, number>();
const SAVE_DEBOUNCE_TIME = 2000; // 2 seconds

// Enhanced save member function that uses relationship tables
export async function saveMemberWithRelationships(
  member: Member,
): Promise<void> {
  try {
    const operationKey = `save-${member.id}`;

    // Check if we're already saving this member
    if (ongoingOperations.has(operationKey)) {
      console.log(
        "⏭️ Skipping duplicate save operation for member:",
        member.id,
      );
      return;
    }

    // Check if we recently saved this member (debouncing)
    const lastSaved = recentlySaved.get(member.id);
    if (lastSaved && Date.now() - lastSaved < SAVE_DEBOUNCE_TIME) {
      console.log("⏭️ Skipping recently saved member:", member.id);
      return;
    }

    // Mark operation as ongoing
    ongoingOperations.add(operationKey);
    recentlySaved.set(member.id, Date.now());

    console.log("🔄 Saving member with relationships:", {
      memberId: member.id,
      name: member.name,
      coursesCount: member.courseGroups?.length || 0,
      dietPlansCount: member.dietPlanGroups?.length || 0,
    });

    // 1. Save basic member info (without courses/diet plans) - NO SYNC
    const basicMemberData = {
      ...member,
      courseGroups: [], // Don't save in JSON fields
      dietPlanGroups: [], // Don't save in JSON fields
      courses: [], // Clear legacy fields
      dietPlans: [], // Clear legacy fields
    };

    // Save to local storage directly without triggering sync
    await gymDB.saveMember(basicMemberData);

    // 2. Handle courses relationships
    const courseIds: string[] = [];
    if (member.courseGroups && Array.isArray(member.courseGroups)) {
      member.courseGroups.forEach((group) => {
        if (group && group.courseIds && Array.isArray(group.courseIds)) {
          courseIds.push(...group.courseIds);
        }
      });
    }

    // 3. Handle diet plans relationships
    const dietPlanIds: string[] = [];
    if (member.dietPlanGroups && Array.isArray(member.dietPlanGroups)) {
      member.dietPlanGroups.forEach((group) => {
        if (group && group.dietPlanIds && Array.isArray(group.dietPlanIds)) {
          dietPlanIds.push(...group.dietPlanIds);
        }
      });
    }

    // 4. Save relationships to Supabase if online
    if (navigator.onLine) {
      try {
        const success = await updateMemberWithRelationships(
          member,
          courseIds,
          dietPlanIds,
        );

        if (success) {
          console.log("✅ Member relationships saved successfully");
        } else {
          console.warn("⚠️ Failed to save member relationships");
        }
      } catch (error) {
        console.error("❌ Error saving relationships to Supabase:", error);
        // Continue - will retry later
      }
    }

    console.log("✅ Member saved with relationships:", {
      memberId: member.id,
      coursesAssigned: courseIds.length,
      dietPlansAssigned: dietPlanIds.length,
    });
  } catch (error) {
    console.error("❌ Error in saveMemberWithRelationships:", error);
    throw error;
  } finally {
    // Always clean up operation tracking
    const operationKey = `save-${member.id}`;
    ongoingOperations.delete(operationKey);

    // Clean up old recent saves
    setTimeout(() => {
      const cutoff = Date.now() - SAVE_DEBOUNCE_TIME * 2;
      for (const [key, timestamp] of recentlySaved.entries()) {
        if (timestamp < cutoff) {
          recentlySaved.delete(key);
        }
      }
    }, SAVE_DEBOUNCE_TIME * 2);
  }
}

// Enhanced update member function
export async function updateMemberWithRelationships(
  member: Member,
): Promise<void> {
  try {
    console.log("🔄 Updating member with relationships:", {
      memberId: member.id,
      name: member.name,
    });

    // Use save function (it handles both create and update)
    await saveMemberWithRelationships(member);

    console.log("✅ Member updated with relationships");
  } catch (error) {
    console.error("❌ Error in updateMemberWithRelationships:", error);
    throw error;
  }
}

// Direct member save without sync (for internal use)
export async function saveMemberDirectly(member: Member): Promise<void> {
  try {
    console.log("💾 Saving member directly (no sync):", member.id);

    // Save directly to local database without triggering any sync
    await gymDB.saveMember(basicMemberData);

    console.log("✅ Member saved directly");
  } catch (error) {
    console.error("❌ Error saving member directly:", error);
    throw error;
  }
}

// Enhanced get members function that loads relationships
export async function getMembersWithRelationships(): Promise<Member[]> {
  try {
    console.log("📋 Loading members with relationships");

    // Try to get from Supabase with relationships first
    if (navigator.onLine) {
      try {
        const membersWithRelationships = await getAllMembersWithRelationships();
        if (membersWithRelationships.length > 0) {
          console.log("✅ Loaded members from Supabase with relationships:", {
            count: membersWithRelationships.length,
          });
          return membersWithRelationships;
        }
      } catch (error) {
        console.warn(
          "⚠️ Failed to load from Supabase, using local data:",
          error,
        );
      }
    }

    // Fallback to local data
    const localMembers = await unifiedDB.getMembers();
    console.log("✅ Loaded members from local storage:", {
      count: localMembers.length,
    });

    return localMembers;
  } catch (error) {
    console.error("❌ Error loading members:", error);
    return [];
  }
}

// Enhanced get member by ID function
export async function getMemberByIdWithRelationships(
  id: string,
): Promise<Member | null> {
  try {
    console.log("🔍 Loading member by ID with relationships:", id);

    // Try Supabase first if online
    if (navigator.onLine) {
      try {
        const memberWithRelationships = await getMemberWithRelationships(id);
        if (memberWithRelationships) {
          console.log("✅ Loaded member from Supabase with relationships");
          return memberWithRelationships;
        }
      } catch (error) {
        console.warn(
          "⚠️ Failed to load from Supabase, using local data:",
          error,
        );
      }
    }

    // Fallback to local data
    const localMember = await unifiedDB.getMemberById(id);
    if (localMember) {
      console.log("✅ Loaded member from local storage");
    } else {
      console.log("❌ Member not found");
    }

    return localMember;
  } catch (error) {
    console.error("❌ Error loading member by ID:", error);
    return null;
  }
}

// Function to migrate existing members to use relationship tables
export async function migrateExistingMembersToRelationships(): Promise<{
  success: boolean;
  migrated: number;
  errors: number;
}> {
  try {
    console.log("🔄 Starting migration of existing members to relationships");

    const members = await unifiedDB.getMembers();
    let migrated = 0;
    let errors = 0;

    for (const member of members) {
      try {
        // Check if member has courses or diet plans in old format
        const hasOldCourses = member.courses && member.courses.length > 0;
        const hasOldDietPlans = member.dietPlans && member.dietPlans.length > 0;
        const hasOldCourseGroups =
          member.courseGroups && member.courseGroups.length > 0;
        const hasOldDietPlanGroups =
          member.dietPlanGroups && member.dietPlanGroups.length > 0;

        if (
          hasOldCourses ||
          hasOldDietPlans ||
          hasOldCourseGroups ||
          hasOldDietPlanGroups
        ) {
          console.log(`🔄 Migrating member: ${member.name} (${member.id})`);

          // Extract course IDs
          const courseIds: string[] = [];
          if (member.courses) {
            courseIds.push(...member.courses);
          }
          if (member.courseGroups) {
            member.courseGroups.forEach((group) => {
              if (group.courseIds) {
                courseIds.push(...group.courseIds);
              }
            });
          }

          // Extract diet plan IDs
          const dietPlanIds: string[] = [];
          if (member.dietPlans) {
            dietPlanIds.push(...member.dietPlans);
          }
          if (member.dietPlanGroups) {
            member.dietPlanGroups.forEach((group) => {
              if (group.dietPlanIds) {
                dietPlanIds.push(...group.dietPlanIds);
              }
            });
          }

          // Remove duplicates
          const uniqueCourseIds = [...new Set(courseIds)];
          const uniqueDietPlanIds = [...new Set(dietPlanIds)];

          // Update using relationship tables (directly without circular calls)
          const success = await updateMemberWithRelationships(
            member,
            uniqueCourseIds,
            uniqueDietPlanIds,
          );

          if (success) {
            migrated++;
            console.log(`✅ Migrated member: ${member.name}`);
          } else {
            errors++;
            console.error(`❌ Failed to migrate member: ${member.name}`);
          }
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error migrating member ${member.name}:`, error);
      }
    }

    console.log("✅ Migration completed:", { migrated, errors });

    return {
      success: errors === 0,
      migrated,
      errors,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return {
      success: false,
      migrated: 0,
      errors: 1,
    };
  }
}

// Function to verify relationship data integrity
export async function verifyRelationshipIntegrity(): Promise<{
  isValid: boolean;
  issues: string[];
  stats: {
    totalMembers: number;
    membersWithCourses: number;
    membersWithDietPlans: number;
    totalCourseAssignments: number;
    totalDietPlanAssignments: number;
  };
}> {
  try {
    console.log("🔍 Verifying relationship data integrity");

    const issues: string[] = [];
    const stats = {
      totalMembers: 0,
      membersWithCourses: 0,
      membersWithDietPlans: 0,
      totalCourseAssignments: 0,
      totalDietPlanAssignments: 0,
    };

    // Get members with relationships
    const members = await getMembersWithRelationships();
    stats.totalMembers = members.length;

    for (const member of members) {
      // Check courses
      if (member.courseGroups && member.courseGroups.length > 0) {
        stats.membersWithCourses++;
        member.courseGroups.forEach((group) => {
          if (group.courseIds) {
            stats.totalCourseAssignments += group.courseIds.length;
          }
        });
      }

      // Check diet plans
      if (member.dietPlanGroups && member.dietPlanGroups.length > 0) {
        stats.membersWithDietPlans++;
        member.dietPlanGroups.forEach((group) => {
          if (group.dietPlanIds) {
            stats.totalDietPlanAssignments += group.dietPlanIds.length;
          }
        });
      }

      // Check for data inconsistencies
      if (member.courses && member.courses.length > 0) {
        issues.push(
          `Member ${member.name} still has data in legacy courses field`,
        );
      }

      if (member.dietPlans && member.dietPlans.length > 0) {
        issues.push(
          `Member ${member.name} still has data in legacy dietPlans field`,
        );
      }
    }

    const isValid = issues.length === 0;

    console.log("✅ Integrity check completed:", {
      isValid,
      issuesCount: issues.length,
      stats,
    });

    return {
      isValid,
      issues,
      stats,
    };
  } catch (error) {
    console.error("❌ Integrity check failed:", error);
    return {
      isValid: false,
      issues: [`Verification failed: ${error}`],
      stats: {
        totalMembers: 0,
        membersWithCourses: 0,
        membersWithDietPlans: 0,
        totalCourseAssignments: 0,
        totalDietPlanAssignments: 0,
      },
    };
  }
}

// Status monitoring
export function getOperationStatus() {
  return {
    ongoingOperations: Array.from(ongoingOperations),
    recentlySaved: Array.from(recentlySaved.entries()),
    operationCount: ongoingOperations.size,
  };
}

// Force clear all ongoing operations (emergency)
export function clearAllOperations() {
  ongoingOperations.clear();
  recentlySaved.clear();
  console.log("🧹 Cleared all ongoing operations");
}
