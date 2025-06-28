import { Injectable } from "@angular/core";
import { ContextService } from "./context.service";
import { HabiticaService } from "./habitica.service";
import { HabiticaUserPreferences } from "../models/habitica.model";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(
    private readonly context: ContextService,
    private readonly habiticaService: HabiticaService,
  ) {}

  async getUserPreferences(): Promise<HabiticaUserPreferences> {
    const userId = this.context.userId;
    const token = this.context.apiToken;

    const userInfo = await this.habiticaService.getUserInfo(userId, token);
    return userInfo.preferences;
  }
}
