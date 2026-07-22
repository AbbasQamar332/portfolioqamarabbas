bbas> cd c:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas; powershell -Command "Get-ChildItem -Recurse -Filter 'route.ts' | Select-String -Pattern 'supabase|supabaseAdmin' | Select-Object -Property Filename, Line
PS C:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas> cd c:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas && rm -rf tools/ 2>nul; rm -f types/sql.js.d.ts lib/supabase.ts lib/supabase-server.ts lib/db-schema.sql 2>nul
At line:1 char:63
+ ... c:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas && rm -rf  ...
+                                                                ~~
The token '&&' is not a valid statement separator in this version.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : InvalidEndOfLine
 
PS C:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas> cd c:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas; rm -rf tools
Remove-Item : A parameter cannot be found that matches parameter name 'rf'.
At line:1 char:67
+ ... Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas; rm -rf tools
+                                                                 ~~~
    + CategoryInfo          : InvalidArgument: (:) [Remove-Item], ParameterBindingException
    + FullyQualifiedErrorId : NamedParameterNotFound,Microsoft.PowerShell.Commands.RemoveIt 
   emCommand
 
PS C:\Users\lenovo\Desktop\portfolio\portfolio-of-Qamar-Abbas> import { NextRequest, NextResponse } from "next/server";
import { getDb, run, initializeDatabase } from "@/lib/database";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await initializeDatabase();
    const db = await getDb();

    run(db, "UPDATE skills SET name = ?, category = ?, percentage = ?, icon_url = ?, order_index = ? WHERE id = ?", [
      body.name, body.category, body.percentage, body.icon_url, body.order_index, params.id
    ]);

    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    const db = await getDb();
    run(db, "DELETE FROM skills WHERE id = ?", [params.id]);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
