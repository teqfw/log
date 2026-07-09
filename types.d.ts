declare global {
  type TeqFw_Log_Enum_Level = typeof import("./src/Enum/Level.mjs").default;
  type TeqFw_Log_Level = TeqFw_Log_Enum_Level[keyof TeqFw_Log_Enum_Level];

  type TeqFw_Log_Provider__Factory = typeof import("./src/Provider.mjs").default;
  type TeqFw_Log_Provider = InstanceType<TeqFw_Log_Provider__Factory>;

  type TeqFw_Log_Logger__Factory = typeof import("./src/Logger.mjs").default;
  type TeqFw_Log_Logger = InstanceType<typeof import("./src/Logger.mjs").default>;

  type TeqFw_Log_Record_Factory = {
    create: typeof import("./src/Record/Factory.mjs").createLogRecord;
  };
  type TeqFw_Log_Record = ReturnType<typeof import("./src/Record/Factory.mjs").createLogRecord>;
  type TeqFw_Log_Data = NonNullable<TeqFw_Log_Record["data"]>;

  type TeqFw_Log_Console_Writer__Factory = typeof import("./src/Console/Writer.mjs").default;
  type TeqFw_Log_Console_Writer = InstanceType<typeof import("./src/Console/Writer.mjs").default>;
}

export {};
