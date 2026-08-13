import { memo } from "react";

import gakt from "../../assets/ghost-tokens/akt.png";
import garb from "../../assets/ghost-tokens/arb.png";
import gatom from "../../assets/ghost-tokens/atom.png";
import gcro from "../../assets/ghost-tokens/cro.png";
import gdot from "../../assets/ghost-tokens/dot.png";
import gfet from "../../assets/ghost-tokens/fet.png";
import gglmr from "../../assets/ghost-tokens/glmr.png";
import ggpaxg from "../../assets/ghost-tokens/gpaxg.png";
import ginj from "../../assets/ghost-tokens/inj.png";
import gjuno from "../../assets/ghost-tokens/juno.png";
import gkuji from "../../assets/ghost-tokens/kuji.png";
import gluna from "../../assets/ghost-tokens/luna.png";
import glunc from "../../assets/ghost-tokens/lunc.png";
import gntrn from "../../assets/ghost-tokens/ntrn.png";
import gosmo from "../../assets/ghost-tokens/osmo.png";
import gscrt from "../../assets/ghost-tokens/scrt.png";
import {
  default as gsol,
  default as gwhsol,
} from "../../assets/ghost-tokens/sol.png";
import gstars from "../../assets/ghost-tokens/stars.png";
import gstatom from "../../assets/ghost-tokens/statom.png";
import gstosmo from "../../assets/ghost-tokens/stosmo.png";
import gusdc from "../../assets/ghost-tokens/usdc.png";
import {
  default as gusk,
  default as xusk,
} from "../../assets/ghost-tokens/usk.png";
import gwavax from "../../assets/ghost-tokens/wavax.png";
import gwbnb from "../../assets/ghost-tokens/wbnb.png";
import gweth from "../../assets/ghost-tokens/weth.png";
import gwftm from "../../assets/ghost-tokens/wftm.png";
import gwglmr from "../../assets/ghost-tokens/wglmr.png";
import gwmatic from "../../assets/ghost-tokens/wmatic.png";

import def from "../../assets/tokens/default.png";

import aave from "../../assets/tokens/aave.png";
import acre from "../../assets/tokens/acre.png";
import akt from "../../assets/tokens/akt.png";
import amber from "../../assets/tokens/amber.png";
import ampkuji from "../../assets/tokens/ampkuji.png";
import ampluna from "../../assets/tokens/ampluna.png";
import ampmnta from "../../assets/tokens/ampmnta.png";
import ampwhale from "../../assets/tokens/ampwhale.png";
import andr from "../../assets/tokens/andr.png";
import aqla from "../../assets/tokens/aqla.png";
import aqua from "../../assets/tokens/aqua.png";
import arb from "../../assets/tokens/arb.png";
import arch from "../../assets/tokens/arch.png";
import astro from "../../assets/tokens/astro.png";
import atom from "../../assets/tokens/atom.png";
import auto from "../../assets/tokens/auto.png";
import avax from "../../assets/tokens/avax.png";
import axl from "../../assets/tokens/axl.png";
import bad from "../../assets/tokens/bad.png";
import bch from "../../assets/tokens/bch.png";
import bfit from "../../assets/tokens/bfit.png";
import { default as bnb, default as wbnb } from "../../assets/tokens/bnb.png";
import { default as btc, default as btcb } from "../../assets/tokens/btc.png";
import brune from "../../assets/tokens/brune.png";
import busd from "../../assets/tokens/busd.png";
import cbbtc from "../../assets/tokens/cbbtc.png";
import cheq from "../../assets/tokens/cheq.png";
import cmdx from "../../assets/tokens/cmdx.png";
import cmst from "../../assets/tokens/cmst.png";
import cnto from "../../assets/tokens/cnto.png";
import core from "../../assets/tokens/core.png";
import crbrus from "../../assets/tokens/crbrus.png";
import cre from "../../assets/tokens/cre.png";
import cro from "../../assets/tokens/cro.png";
import cub from "../../assets/tokens/cub.png";
import dai from "../../assets/tokens/dai.png";
import demo from "../../assets/tokens/demo.png";
import doge from "../../assets/tokens/doge.png";
import dot from "../../assets/tokens/dot.png";
import dpi from "../../assets/tokens/dpi.png";
import dvpn from "../../assets/tokens/dvpn.png";
import dydx from "../../assets/tokens/dydx.png";
import dym from "../../assets/tokens/dym.png";
import {
  default as axleth,
  default as eth,
  default as weth,
} from "../../assets/tokens/eth.png";
import evmos from "../../assets/tokens/evmos.png";
import flip from "../../assets/tokens/flip.png";
import flix from "../../assets/tokens/flix.png";
import fox from "../../assets/tokens/fox.png";
import frnz from "../../assets/tokens/frnz.png";
import furylegacy from "../../assets/tokens/fury.legacy.png";
import fury from "../../assets/tokens/fury.png";
import {
  default as fuzn,
  default as yfuzn,
} from "../../assets/tokens/fuzn.png";
import {
  default as glmr,
  default as wglmr,
} from "../../assets/tokens/glmr.png";
import glto from "../../assets/tokens/glto.png";
import {
  default as gpaxg,
  default as paxg,
} from "../../assets/tokens/gpaxg.png";
import {
  default as grav,
  default as graviton,
} from "../../assets/tokens/grav.png";
import gusd from "../../assets/tokens/gusd.png";
import inj from "../../assets/tokens/inj.png";
import jkl from "../../assets/tokens/jkl.png";
import juno from "../../assets/tokens/juno.png";
import kart from "../../assets/tokens/kart.png";
import kuji from "../../assets/tokens/kuji.png";
import kune from "../../assets/tokens/kune.png";
import link from "../../assets/tokens/link.png";
import loop from "../../assets/tokens/loop.png";
import lqdy from "../../assets/tokens/lqdy.png";
import ltc from "../../assets/tokens/ltc.png";
import luna from "../../assets/tokens/luna.png";
import lunc from "../../assets/tokens/lunc.png";
import lusd from "../../assets/tokens/lusd.png";
import lvn from "../../assets/tokens/lvn.png";
import mars from "../../assets/tokens/mars.png";
import mnta from "../../assets/tokens/mnta.png";
import mntl from "../../assets/tokens/mntl.png";
import nami from "../../assets/tokens/nami.png";
import nausd from "../../assets/tokens/nausd.png";
import nbtc from "../../assets/tokens/nbtc.png";
import neok from "../../assets/tokens/neok.png";
import newt from "../../assets/tokens/newt.png";
import nstk from "../../assets/tokens/nstk.png";
import ntrn from "../../assets/tokens/ntrn.png";
import odin from "../../assets/tokens/odin.png";
import osmo from "../../assets/tokens/osmo.png";
import pepe from "../../assets/tokens/pepe.png";
import plnk from "../../assets/tokens/plnk.png";
import plq from "../../assets/tokens/plq.png";
import qcatom from "../../assets/tokens/qcatom.png";
import qcfuzn from "../../assets/tokens/qcfuzn.png";
import qckuji from "../../assets/tokens/qckuji.png";
import qcmnta from "../../assets/tokens/qcmnta.png";
import raclegacy from "../../assets/tokens/rac.legacy.png";
import rac from "../../assets/tokens/rac.png";
import ratom from "../../assets/tokens/ratom.png";
import raze from "../../assets/tokens/raze.png";
import regen from "../../assets/tokens/regen.png";
import rfuzn from "../../assets/tokens/rfuzn.png";
import rio from "../../assets/tokens/rio.png";
import rji from "../../assets/tokens/rji.png";
import rkuji from "../../assets/tokens/rkuji.png";
import roar from "../../assets/tokens/roar.png";
import ruji from "../../assets/tokens/ruji.png";
import rune from "../../assets/tokens/rune.png";
import sayve from "../../assets/tokens/sayve.png";
import scrt from "../../assets/tokens/scrt.png";
import shdlegacy from "../../assets/tokens/shd.legacy.png";
import shd from "../../assets/tokens/shd.png";
import silk from "../../assets/tokens/silk.png";
import snx from "../../assets/tokens/snx.png";
import { default as sol, default as whsol } from "../../assets/tokens/sol.png";
import somm from "../../assets/tokens/somm.png";
import stars from "../../assets/tokens/stars.png";
import statom from "../../assets/tokens/statom.png";
import stinj from "../../assets/tokens/stinj.png";
import stluna from "../../assets/tokens/stluna.png";
import stosmo from "../../assets/tokens/stosmo.png";
import strd from "../../assets/tokens/strd.png";
import swth from "../../assets/tokens/swth.png";
import tcy from "../../assets/tokens/tcy.png";
import tgt from "../../assets/tokens/tgt.png";
import thor from "../../assets/tokens/thor.png";
import tia from "../../assets/tokens/tia.png";
import ton from "../../assets/tokens/ton.png";
import tori from "../../assets/tokens/tori.png";
import trx from "../../assets/tokens/trx.png";
import twt from "../../assets/tokens/twt.png";
import umee from "../../assets/tokens/umee.png";
import uni from "../../assets/tokens/uni.png";
import usdc from "../../assets/tokens/usdc.png";
import usdp from "../../assets/tokens/usdp.png";
import usdt from "../../assets/tokens/usdt.png";
import usk from "../../assets/tokens/usk.png";
import ustc from "../../assets/tokens/ustc.png";
import vthor from "../../assets/tokens/vthor.png";
import vvv from "../../assets/tokens/vvv.png";
import wavax from "../../assets/tokens/wavax.png";
import wbtc from "../../assets/tokens/wbtc.png";
import { default as ftm, default as wftm } from "../../assets/tokens/wftm.png";
import whale from "../../assets/tokens/whale.png";
import {
  default as local,
  default as whlocal,
} from "../../assets/tokens/whlocal.png";
import wink from "../../assets/tokens/wink.png";
import {
  default as matic,
  default as wmatic,
} from "../../assets/tokens/wmatic.png";
import wsteth from "../../assets/tokens/wsteth.png";
import { default as tao, default as wtao } from "../../assets/tokens/wtao.png";
import xastro from "../../assets/tokens/xastro.png";
import xdefi from "../../assets/tokens/xdefi.png";
import xrp from "../../assets/tokens/xrp.png";
import xrune from "../../assets/tokens/xrune.png";
import yfi from "../../assets/tokens/yfi.png";
import yieldeth from "../../assets/tokens/yieldeth.png";
import yrune from "../../assets/tokens/yrune.png";
import ytcy from "../../assets/tokens/ytcy.png";
import yum from "../../assets/tokens/yum.png";

import clsx from "clsx";

const getSRC = (src: string, ghost?: boolean) => {
  const trimmed = src.endsWith(".legacy") ? src : src.split(".").at(0) || "";
  if (ghost) {
    return (
      {
        akt: gakt,
        arb: garb,
        atom: gatom,
        cro: gcro,
        dot: gdot,
        fet: gfet,
        glmr: gglmr,
        gpaxg: ggpaxg,
        inj: ginj,
        juno: gjuno,
        kuji: gkuji,
        luna: gluna,
        lunc: glunc,
        ntrn: gntrn,
        osmo: gosmo,
        scrt: gscrt,
        sol: gsol,
        stars: gstars,
        statom: gstatom,
        stosmo: gstosmo,
        usdc: gusdc,
        usk: gusk,
        wavax: gwavax,
        wbnb: gwbnb,
        weth: gweth,
        wftm: gwftm,
        wglmr: gwglmr,
        wmatic: gwmatic,
        whsol: gwhsol,
      }[trimmed] || def
    );
  }
  return (
    {
      aave,
      acre,
      akt,
      amber,
      ampkuji,
      ampluna,
      ampmnta,
      ampwhale,
      andr,
      aqla,
      aqua,
      arb,
      arch,
      astro,
      atom,
      auto,
      avax,
      axl,
      axleth,
      bad,
      bch,
      bfit,
      bnb,
      brune,
      btc,
      btcb,
      busd,
      cbbtc,
      cheq,
      cmdx,
      cmst,
      cnto,
      core,
      crbrus,
      cre,
      cro,
      cub,
      dai,
      demo,
      doge,
      dot,
      dpi,
      dvpn,
      dydx,
      dym,
      eth,
      evmos,
      flip,
      flix,
      fox,
      frnz,
      ftm,
      fury,
      furylegacy,
      fuzn,
      glmr,
      glto,
      gpaxg,
      grav,
      graviton,
      gusd,
      inj,
      jkl,
      juno,
      kart,
      kuji,
      kune,
      link,
      local,
      loop,
      lqdy,
      ltc,
      luna,
      lunc,
      lusd,
      lvn,
      mars,
      matic,
      mnta,
      mntl,
      nami,
      nausd,
      nbtc,
      neok,
      newt,
      nstk,
      ntrn,
      odin,
      osmo,
      paxg,
      pepe,
      plnk,
      plq,
      qcatom,
      qcfuzn,
      qckuji,
      qcmnta,
      rac,
      raclegacy,
      ratom,
      raze,
      regen,
      rfuzn,
      rio,
      rji,
      rkuji,
      roar,
      ruji,
      rune,
      sayve,
      scrt,
      shd,
      shdlegacy,
      silk,
      snx,
      sol,
      somm,
      stars,
      statom,
      stinj,
      stluna,
      stosmo,
      strd,
      swth,
      tao,
      tcy,
      tgt,
      tia,
      tori,
      thor,
      ton,
      trx,
      twt,
      umee,
      uni,
      usdc,
      usdp,
      usdt,
      usk,
      ustc,
      vthor,
      vvv,
      wavax,
      wbnb,
      wbtc,
      weth,
      wftm,
      wglmr,
      whale,
      whlocal,
      whsol,
      wink,
      wmatic,
      wsteth,
      wtao,
      xastro,
      xdefi,
      xrp,
      xrune,
      xusk,
      yfi,
      yfuzn,
      yieldeth,
      yrune,
      ytcy,
      yum,
    }[trimmed] || def
  );
};

export const IconDenom = memo(
  ({ denom, className }: { denom: string; className?: string }) => {
    return (
      <img
        src={getSRC(denom.toLowerCase())}
        className={clsx({ "icon-denom": true, [`${className}`]: className })}
      />
    );
  }
);

export const getDenomIconSrc = (denom: string) => getSRC(denom.toLowerCase());
