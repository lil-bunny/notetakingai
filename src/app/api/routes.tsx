import { Error, createClient } from "speech-to-text";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  const url = request.url;
  const speechtext = createClient(process.env.key ?? "");

  let { result: projectsResult, error: projectsError } =
    await speechtext.manage.getProjects();

  if (projectsError) {
    return NextResponse.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return NextResponse.json(
      new Error(
        "Cannot find key."
      )
    );
  }

  let { result: newKeyResult, error: newKeyError } =
    await speechtext.manage.createProjectKey(project.project_id, {
      comment: "Temporary API key",
      scopes: ["usage:write"],
      tags: ["next.js"],
      time_to_live_in_seconds: 10,
    });

  if (newKeyError) {
    return NextResponse.json(newKeyError);
  }

  return NextResponse.json({ ...newKeyResult, url });
}
