const PRIVATE_META_KEY = "private";
export const SCHEMA_VERSION = "1.0.0";

export function sanitizeResume(resume) {
  const clone = JSON.parse(JSON.stringify(resume));
  clone.schema_version = clone.schema_version ?? SCHEMA_VERSION;

  if (clone.basics) {
    delete clone.basics.phone;

    const emailIsPublic = clone.meta?.publicContact?.email === true;
    if (!emailIsPublic) {
      delete clone.basics.email;
    }

    if (clone.basics.location) {
      delete clone.basics.location.address;
      delete clone.basics.location.postalCode;
    }
  }

  removePrivateMeta(clone);
  return clone;
}

function removePrivateMeta(value) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(removePrivateMeta);
    return;
  }

  delete value[PRIVATE_META_KEY];

  for (const child of Object.values(value)) {
    removePrivateMeta(child);
  }
}
