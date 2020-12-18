import * as fuzzy from "fuzzy";
import Telegraf, { Markup } from "telegraf";
import { NextApiRequest, NextApiResponse } from "next";
import { TelegrafContext } from "telegraf/typings/context";
import * as tt from "telegraf/typings/telegram-types";

interface IM extends tt.IncomingMessage {
  via_bot?: boolean;
}

interface TC extends TelegrafContext {
  message?: IM;
  replyWithAnimation(
    animation: tt.InputFile,
    extra?: tt.ExtraAnimation
  ): Promise<tt.MessageAnimation>;
  startPayload?: string;
}

const bot = new Telegraf<TelegrafContext>(<string>process.env.BOT_TOKEN);

export default async function telegram(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /**
     * Setting up bot with its configs
     */
    const botInfo = await bot.telegram.getMe();
    bot.options.username = botInfo.username;
    console.info("Server has initialized functions for", botInfo.username);

    /**
     * Commands
     */
    // @ts-ignore
    bot.start(async (ctx: TC) => {
      await ctx.replyWithAnimation("https://genemator.me/gifs/start.gif", {
        parse_mode: "HTML",
        caption:
          `<b>Welcome to Genemator's Assistant!</b>` +
          `\n` +
          `\n` +
          `This bot helps you to manage with information about Genemator.` +
          `\n` +
          `With the help of this bot you can do:` +
          `\n` +
          `\n` +
          `<code>* Check current status of the Genemator</code>` +
          `\n` +
          `<code>* Check statuses of github repositories</code>` +
          `\n` +
          `\n` +
          `<i>In order to see full detailed usage information of the bot, press the button below.</i>`,
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Show detailed information", "help")]
        ])
      });
    });
    // @ts-ignore
    bot.help(async (ctx: TC) => {
      await ctx.replyWithAnimation("https://genemator.me/gifs/help.gif", {
        caption:
          `<b>List of available commands:</b>` +
          `\n` +
          `\n` +
          `/help - <code>show this helper message</code>` +
          `\n` +
          `/about - <code>get information about genemator</code>` +
          `\n` +
          `\n` +
          `<i>In order to use our inline mode, switch to inline mode ` +
          `by typing: @genemabot and then start typing something there.</i>`,
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.switchToCurrentChatButton("Search Projects", "")]
        ])
      });
    });
    // @ts-ignore
    bot.command("about", async (ctx: TC) => {
      const text =
        `<b>Senior Developer from Uzbekistan's Top 2 ¯\\_(ツ)_/¯</b>` +
        `\n` +
        `\n` +
        `Hello dear visitor! I’m Sokhibjon Orzikulov, who is famous under the nickname Genemator. I’m glad to see you visit my telegram bot. For the beginning, let me introduce myself. I’m a Senior Full-Stack developer with more than 7 years of experience. Although I professionally code using 7 different programming languages as JavaScript, TypeScript, Java, Kotlin, C, C++, Assembler, Python2, Python3. I mainly use C++ for its total control and wide range of functions. That said, my knowledge is not limited to coding. I am also a specialist in creating 3D driven video and photo. Besides, I prefer Cinema 4D as 3D engine and utilize Adobe Products for editing purposes. I can also create different songs and music for my projects by using special applications on a professional level. For the time being, I am a second-year student at Westminster International University in Tashkent. My nationality is Uzbek and I’m only 19 years old 😎`;
      await ctx.replyWithAnimation("https://genemator.me/gifs/admin.gif", {
        caption: text,
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton("Delete Information", "delete")],
          [Markup.callbackButton("Show Available Commands", "help")]
        ])
      });
    });
    // @ts-ignore
    bot.action("help", async (ctx: TC) => {
      await ctx.editMessageMedia(
        {
          type: "animation",
          media: "https://genemator.me/gifs/help.gif",
          caption:
            `<b>List of available commands:</b>` +
            `\n` +
            `\n` +
            `/help - <code>show this helper message</code>` +
            `\n` +
            `/about - <code>get information about genemator</code>` +
            `\n` +
            `\n` +
            `<i>In order to use our inline mode, switch to inline mode ` +
            `by typing: @genemabot and then start typing something there.</i>`
        },
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.switchToCurrentChatButton("Search Projects", "")]
          ])
        }
      );
    });

    /**
     * Message Deletion
     */
    bot.action("delete", ({ deleteMessage }) => deleteMessage());

    /**
     * Inline Query Handler
     */
    bot.on(
      "inline_query",
      async ({ inlineQuery, answerInlineQuery }): Promise<any> => {
        let results: tt.InlineQueryResult[] = [],
          indexation = 1;
        let found = fuzzy
          .filter(
            <string>inlineQuery?.query,
            Object.values(
              await fetch("https://api.github.com/users/genemators/repos").then(
                (r) => {
                  return r.json();
                }
              )
            ).map(function (obj: any[string]) {
              return obj["name"];
            })
          )
          .sort()
          .slice(0, 20)
          .map(function (obj) {
            return obj.string;
          });
        for (let key of found) {
          let data = await fetch(
            `https://api.github.com/repos/genemators/${key}`
          ).then((r) => {
            return r.json();
          });
          results.push({
            type: "article",
            id: indexation.toString(),
            url: "https://github.com/genemators/" + key,
            title: key,
            thumb_url: "https://genemator.me/favicon.png",
            description: `${data["description"]}`,
            reply_markup: Markup.inlineKeyboard(
              [
                Markup.urlButton(`GitHub`, `${data["html_url"]}`),
                Markup.urlButton(
                  `Download`,
                  `https://github.com/${data["full_name"]}/archive/master.zip`
                ),
                Markup.switchToCurrentChatButton(`Repositories`, ``)
              ],
              { columns: 2 }
            ),
            input_message_content: {
              message_text:
                `<b><a href="${data["html_url"]}">〰 GitHub Project Review 〰</a></b>` +
                `\n` +
                `\n` +
                `<b>Description:</b> ${data["description"]}` +
                `\n` +
                `<b>Programming Language:</b> ${data["language"]}` +
                `\n` +
                `<b>Created Date:</b> ${data["created_at"]}` +
                `\n` +
                `\n` +
                `<code>👁: ${data["watchers_count"]}</code> <b>|</b> ` +
                `<code>🌟: ${data["stargazers_count"]}</code> <b>|</b> ` +
                `<code>👥: ${data["subscribers_count"]}</code> <b>|</b> ` +
                `<code>🔃: ${data["forks_count"]}</code> <b>|</b> ` +
                `<code>❗: ${data["open_issues_count"]}</code>`,
              parse_mode: "HTML",
              disable_web_page_preview: true
            }
          });
          indexation++;
        }
        return answerInlineQuery(results);
      }
    );

    /**
     * Exclusion Exceptions
     */
    // @ts-ignore
    bot.on("text", async (ctx: TC) => {
      if (ctx.chat?.type === "private" && ctx.message?.via_bot) {
        await ctx.replyWithHTML("<b>Yay, you found something useful!?</b>", {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            Markup.callbackButton(`Delete Message`, `delete`)
          ])
        });
      }
      if (ctx.chat?.type === "private" && !ctx.message?.via_bot) {
        await ctx.replyWithHTML(
          "<b>This command or message is invalid. Please see our command list for more information!</b>",
          {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard([
              [Markup.callbackButton(`Show available commands`, `help`)],
              [Markup.callbackButton(`Delete Message`, `delete`)]
            ])
          }
        );
      }
    });

    /**
     * Method Exclusions
     */
    if (req.method === "POST") {
      await bot.handleUpdate(req.body, res);
    } else {
      res.redirect(`https://t.me/${botInfo.username?.replace("@", "")}`);
    }
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.send("<h1>Are you winnin' son?</h1>");
  }
}
